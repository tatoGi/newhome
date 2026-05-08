'use client';

import Image from 'next/image';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Block } from '@/lib/api/types';
import { resolveImageOrFallback } from '@/lib/api/assets';
import { useFallbackLogo } from '@/context/BootstrapContext';

interface ImageTextSectionProps {
  blocks: Block[];
  pageTitle?: string;
  pageDescription?: string;
}

const DEFAULTS = {
  title: 'HomeSpace',
  linkFirst: '/projects',
  linkSecond: '/about',
};

const pickDefined = (...values: unknown[]): string => {
  const value = values.find((item) => item !== null && item !== undefined);

  return String(value ?? '');
};

export default function ImageTextSection({ blocks, pageTitle, pageDescription }: ImageTextSectionProps) {
  const block = blocks.find((b) => b.type === 'image_text');
  const fallbackLogo = useFallbackLogo();
  const title = pickDefined(block?.data?.content_title, block?.data?.section_title, block?.data?.title, pageTitle, DEFAULTS.title);
  const desc = pickDefined(block?.data?.content_text, block?.data?.textarea, pageDescription);
  const image = resolveImageOrFallback(block?.data?.image, fallbackLogo);
  const linkFirst = String(block?.data?.cta_primary_url ?? block?.data?.redairect_link_first ?? DEFAULTS.linkFirst);
  const linkSecond = String(block?.data?.cta_secondary_url ?? block?.data?.redairect_link_second ?? DEFAULTS.linkSecond);

  return (
    <section className="py-5 bg-light overflow-hidden">
      <Container>
        <Row className="align-items-center gy-5">
          <Col lg={6}>
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              {title ? <h2 className="display-5 fw-bold mb-4">{title}</h2> : null}
              {desc ? <div className="lead text-muted mb-4" dangerouslySetInnerHTML={{ __html: desc }} /> : null}
              <div className="d-flex gap-3">
                <Button as={Link as any} href={linkFirst} variant="primary" size="lg" className="px-4">ჩვენს შესახებ</Button>
                <Button as={Link as any} href={linkSecond} variant="outline-primary" size="lg" className="px-4">პროექტები</Button>
              </div>
            </motion.div>
          </Col>
          <Col lg={6}>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
              <Image
                src={image}
                alt={title}
                title={title}
                width={1200}
                height={800}
                sizes="(max-width: 992px) 100vw, 50vw"
                className="img-fluid rounded shadow-lg"
                style={{ objectFit: 'cover' }}
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
