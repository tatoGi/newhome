'use client';

import { Container, Row, Col, Card, Breadcrumb } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { allServices } from '@/lib/data';
import { Block, PostRelation } from '@/lib/api/types';
import { toBackendAssetUrl } from '@/lib/api/assets';
import { slugify } from '@/lib/slugify';

interface ServicesPageProps {
  posts?: PostRelation[];
  pageTitle?: string;
  pageDescription?: string;
  blocks?: Block[];
}

export default function ServicesPage({ posts, pageTitle, pageDescription, blocks }: ServicesPageProps) {
  const heroBlock = [...(blocks ?? [])]
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .find((block) => block.type === 'page_hero' || block.type === 'main_banner' || block.type === 'banner');

  const heroTitle = String(heroBlock?.data?.banner_title ?? heroBlock?.data?.title ?? pageTitle ?? 'სერვისები');
  const heroDescription = String(
    heroBlock?.data?.banner_desc ??
    heroBlock?.data?.banner_description ??
    heroBlock?.data?.description ??
    pageDescription ??
    ''
  );
  const heroImage = toBackendAssetUrl(heroBlock?.data?.banner_image ?? heroBlock?.data?.image ?? '');

  const services = posts && posts.length > 0
    ? posts.map((post) => {
      const intro = post.blocks?.find((b) => b.type === 'post_intro');
      const rawImage = intro?.data?.post_image || post.feature_image || '';
      return {
        id: post.id,
        slug: post.slug,
        title: intro?.data?.title || post.title,
        desc: post.excerpt,
        image: toBackendAssetUrl(rawImage) || '',
      };
    })
    : allServices.map((service) => ({
      id: service.id,
      slug: String(service.id),
      title: service.title,
      desc: service.desc,
      image: service.image,
    }));

  return (
    <Container className="py-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">მთავარი</Breadcrumb.Item>
        <Breadcrumb.Item active>{heroTitle}</Breadcrumb.Item>
      </Breadcrumb>

      {heroImage ? (
        <div
          className="position-relative overflow-hidden rounded-4 mb-5"
          style={{ minHeight: '260px', backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.42), rgba(0,0,0,0.18))' }} />
          <div className="position-relative text-white d-flex flex-column justify-content-end h-100 p-4 p-md-5">
            <h1 className="fw-bold display-5 mb-3">{heroTitle}</h1>
            {heroDescription ? <div className="lead mb-0 opacity-75" style={{ maxWidth: '700px' }} dangerouslySetInnerHTML={{ __html: heroDescription }} /> : null}
          </div>
        </div>
      ) : (
        <div className="text-center mb-5">
          <h1 className="fw-bold display-4 mb-3">{heroTitle}</h1>
          {heroDescription ? <div className="text-muted lead mx-auto" style={{ maxWidth: '700px' }} dangerouslySetInnerHTML={{ __html: heroDescription }} /> : null}
        </div>
      )}

      <Row className="gy-4">
        {services.map((service, index) => (
          <Col key={service.id} md={6}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="border-0 shadow-sm overflow-hidden h-100">
                <Row className="g-0 h-100">
                  <Col md={5}>
                    <Link href={`/service/${slugify(service.slug)}`} className="d-block h-100">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.title}
                          className="img-fluid h-100 w-100"
                          style={{ objectFit: 'cover', minHeight: '200px' }}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="h-100 w-100 bg-light d-flex align-items-center justify-content-center" style={{ minHeight: '200px' }}>
                          <span className="text-muted small">სურათი არ არის</span>
                        </div>
                      )}
                    </Link>
                  </Col>
                  <Col md={7}>
                    <Card.Body className="p-4 d-flex flex-column h-100">
                      <Link href={`/service/${slugify(service.slug)}`} className="fw-bold mb-3 fs-5 text-dark text-decoration-none">{service.title}</Link>
                      <Card.Text as="div" className="text-muted mb-4" dangerouslySetInnerHTML={{ __html: service.desc }} />
                      <Link href={`/service/${slugify(service.slug)}`} className="btn btn-link text-primary p-0 mt-auto text-decoration-none d-flex align-items-center gap-2" style={{ width: 'max-content' }}>
                        დეტალურად <ArrowRight size={18} />
                      </Link>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
