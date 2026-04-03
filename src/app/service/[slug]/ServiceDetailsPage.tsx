'use client';

import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ChevronRight, Phone } from 'lucide-react';
import { toBackendAssetUrl } from '@/lib/api/assets';

interface ServiceProps {
  id: number;
  slug: string;
  title: string;
  desc: string;
  fullDesc: string;
  image: string;
  blocks: any[];
}

export default function ServiceDetailsPage({ service }: { service: ServiceProps }) {
  const intro = service.blocks?.find((b: any) => b.type === 'post_intro');
  const image = toBackendAssetUrl(intro?.data?.post_image || service.image || '');
  const title = intro?.data?.title || service.title;
  const desc = intro?.data?.post_text || service.desc;

  return (
    <div className="pb-5 bg-light min-vh-100">
      {/* Hero */}
      <div
        className="position-relative d-flex align-items-center justify-content-center"
        style={{
          minHeight: '380px',
          backgroundImage: image ? `url(${image})` : undefined,
          backgroundColor: image ? undefined : '#1a3a5c',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.55 }} />
        <div className="position-relative z-1 text-center text-white px-3">
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="display-4 fw-bold mb-3"
          >
            {title}
          </motion.h1>
          {desc && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="lead opacity-75 mx-auto"
              style={{ maxWidth: '600px' }}
              dangerouslySetInnerHTML={{ __html: desc }}
            />
          )}
        </div>
      </div>

      <Container className="mt-n4 position-relative" style={{ zIndex: 2 }}>
        <div className="bg-white p-4 p-md-5 rounded shadow-sm">
          {/* Breadcrumb */}
          <div className="mb-5 d-flex align-items-center text-muted small border-bottom pb-3">
            <Link href="/" className="text-muted text-decoration-none">მთავარი</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link href="/services" className="text-muted text-decoration-none">სერვისები</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-dark fw-medium">{title}</span>
          </div>

          <Row className="gy-5">
            <Col lg={7}>
              {service.fullDesc ? (
                <div
                  className="cms-content text-muted lh-lg fs-5"
                  dangerouslySetInnerHTML={{ __html: service.fullDesc }}
                />
              ) : desc ? (
                <div
                  className="cms-content text-muted lh-lg fs-5"
                  dangerouslySetInnerHTML={{ __html: desc }}
                />
              ) : null}
            </Col>

            <Col lg={5}>
              <div className="bg-primary text-white p-4 p-xl-5 rounded h-100 d-flex flex-column justify-content-center position-relative overflow-hidden">
                <div className="position-relative" style={{ zIndex: 1 }}>
                  <h3 className="fw-bold mb-4">გაქვთ შეკითხვები?</h3>
                  <p className="mb-4 opacity-75 lh-lg">
                    ჩვენი გუნდი მზად არის გაგიწიოთ კონსულტაცია და შეგირჩიოთ საუკეთესო ვარიანტი.
                  </p>
                  <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded" style={{ background: 'rgba(255,255,255,0.12)' }}>
                    <Phone className="opacity-75" />
                    <span className="fs-4 fw-medium">+995 555 12 34 56</span>
                  </div>
                  <Link href="/contact" className="btn btn-light btn-lg w-100 fw-bold text-primary text-uppercase mt-2">
                    დაგვიკავშირდით
                  </Link>
                </div>
                <div className="position-absolute end-0 bottom-0 rounded-circle bg-white opacity-10"
                  style={{ width: 250, height: 250, marginRight: -100, marginBottom: -100 }} />
                <div className="position-absolute start-0 top-0 rounded-circle bg-white opacity-10"
                  style={{ width: 150, height: 150, marginLeft: -50, marginTop: -50 }} />
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}
