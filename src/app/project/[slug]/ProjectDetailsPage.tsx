'use client';

import { Container, Row, Col, Badge, Carousel } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ChevronRight, Calendar, MapPin, Tag } from 'lucide-react';
import { toBackendAssetUrl } from '@/lib/api/assets';

interface ProjectProps {
  id: number;
  slug: string;
  title: string;
  desc: string;
  images: (string | null | undefined)[];
  location?: string;
  year?: string;
  category?: string;
  blocks: any[];
}

export default function ProjectDetailsPage({ project }: { project: ProjectProps }) {
  const intro = project.blocks?.find((b: any) => b.type === 'post_intro');

  const title = intro?.data?.title || project.title;
  const desc = intro?.data?.post_text || project.desc;

  // Collect all images: intro block + feature images, convert to backend URLs, filter empties
  const rawImages = [
    intro?.data?.post_image,
    ...(project.images ?? []),
  ];
  const images = rawImages
    .map((img) => toBackendAssetUrl(img || ''))
    .filter(Boolean) as string[];

  const details = [
    project.category ? { icon: <Tag size={20} />, label: 'კატეგორია', value: project.category } : null,
    project.year     ? { icon: <Calendar size={20} />, label: 'წელი', value: project.year } : null,
    project.location ? { icon: <MapPin size={20} />, label: 'ლოკაცია', value: project.location } : null,
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string }[];

  return (
    <div className="pb-5 bg-light min-vh-100">
      <Container className="pt-4">
        {/* Breadcrumb */}
        <div className="mb-4 d-flex align-items-center text-muted small">
          <Link href="/" className="text-muted text-decoration-none">მთავარი</Link>
          <ChevronRight size={14} className="mx-2" />
          <Link href="/projects" className="text-muted text-decoration-none">პროექტები</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-dark fw-medium">{title}</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="bg-white p-4 p-md-5 rounded shadow-sm mb-5"
        >
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end mb-4 gap-3">
            <div>
              {project.category && (
                <Badge bg="primary" className="mb-2 px-3 py-2">{project.category}</Badge>
              )}
              <h1 className="fw-bold mb-0 display-5">{title}</h1>
            </div>
            {project.year && (
              <div className="text-muted border-start ps-4">
                <span className="d-block small text-uppercase">წელი</span>
                <span className="fs-5 fw-bold text-dark">{project.year}</span>
              </div>
            )}
          </div>

          {/* Images */}
          {images.length > 1 ? (
            <div className="mb-5 rounded overflow-hidden shadow-sm">
              <Carousel indicators={images.length > 1} controls={images.length > 1}>
                {images.map((img, idx) => (
                  <Carousel.Item key={idx}>
                    <img
                      src={img}
                      alt={`${title} ${idx + 1}`}
                      className="w-100"
                      style={{ height: '500px', objectFit: 'cover' }}
                      referrerPolicy="no-referrer"
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          ) : images.length === 1 ? (
            <div className="mb-5 rounded overflow-hidden shadow-sm">
              <img
                src={images[0]}
                alt={title}
                className="w-100"
                style={{ maxHeight: '500px', objectFit: 'cover' }}
                referrerPolicy="no-referrer"
              />
            </div>
          ) : null}

          <Row className="gy-5">
            <Col lg={details.length > 0 ? 8 : 12}>
              <h3 className="fw-bold mb-4">პროექტის შესახებ</h3>
              {desc ? (
                <div
                  className="cms-content text-muted lh-lg fs-5"
                  dangerouslySetInnerHTML={{ __html: desc }}
                />
              ) : null}
            </Col>

            {details.length > 0 && (
              <Col lg={4}>
                <div className="bg-light p-4 rounded border">
                  <h4 className="fw-bold mb-4">დეტალები</h4>
                  <div className="d-flex flex-column gap-4">
                    {details.map((item, i) => (
                      <div key={i} className="d-flex align-items-center gap-3">
                        <div className="bg-white p-2 rounded shadow-sm text-primary">{item.icon}</div>
                        <div>
                          <span className="d-block small text-muted">{item.label}</span>
                          <span className="fw-medium text-dark">{item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </motion.div>
      </Container>
    </div>
  );
}
