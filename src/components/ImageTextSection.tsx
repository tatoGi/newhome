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

const pickDefined = (...values: unknown[]): string => {
  const value = values.find((item) => item !== null && item !== undefined && String(item).trim() !== '');

  return String(value ?? '');
};

export default function ImageTextSection({ blocks, pageTitle, pageDescription }: ImageTextSectionProps) {
  const block = blocks.find((b) => b.type === 'image_text');
  const fallbackLogo = useFallbackLogo();

  if (!block) return null;

  const title = pickDefined(block.data?.content_title, block.data?.section_title, block.data?.title, pageTitle);
  const desc = pickDefined(block.data?.content_text, block.data?.textarea, pageDescription);
  const rawImage = block.data?.image;
  const image = resolveImageOrFallback(rawImage, fallbackLogo);
  const ctaPrimaryLabel = pickDefined(block.data?.cta_primary_label, block.data?.cta_primary_text);
  const ctaSecondaryLabel = pickDefined(block.data?.cta_secondary_label, block.data?.cta_secondary_text);
  const linkFirst = pickDefined(block.data?.cta_primary_url, block.data?.redairect_link_first);
  const linkSecond = pickDefined(block.data?.cta_secondary_url, block.data?.redairect_link_second);

  return (
    <section className="py-5 bg-light overflow-hidden">
      <Container>
        <Row className="align-items-center gy-5">
          <Col lg={6}>
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              {title ? <h2 className="display-5 fw-bold mb-4">{title}</h2> : null}
              {desc ? <div className="lead text-muted mb-4" dangerouslySetInnerHTML={{ __html: desc }} /> : null}
              {(ctaPrimaryLabel && linkFirst) || (ctaSecondaryLabel && linkSecond) ? (
                <div className="d-flex gap-3">
                  {ctaPrimaryLabel && linkFirst ? (
                    <Button as={Link as any} href={linkFirst} variant="primary" size="lg" className="px-4">{ctaPrimaryLabel}</Button>
                  ) : null}
                  {ctaSecondaryLabel && linkSecond ? (
                    <Button as={Link as any} href={linkSecond} variant="outline-primary" size="lg" className="px-4">{ctaSecondaryLabel}</Button>
                  ) : null}
                </div>
              ) : null}
            </motion.div>
          </Col>
          {rawImage ? (
            <Col lg={6}>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
                <Image
                  src={image}
                  alt={title || 'image'}
                  title={title || ''}
                  width={1200}
                  height={800}
                  sizes="(max-width: 992px) 100vw, 50vw"
                  className="img-fluid rounded shadow-lg"
                  style={{ objectFit: 'cover' }}
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </Col>
          ) : null}
        </Row>
      </Container>
    </section>
  );
}
