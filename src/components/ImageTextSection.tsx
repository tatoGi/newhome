'use client';

import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Block } from '@/lib/api/types';
import { toBackendAssetUrl } from '@/lib/api/assets';

interface ImageTextSectionProps {
  blocks: Block[];
  pageTitle?: string;
  pageDescription?: string;
}

const DEFAULTS = {
  title: 'NewHome - თქვენი სახლის დიზაინის პარტნიორი',
  desc: 'ჩვენი მისიაა შევქმნათ გარემო, რომელიც ასახავს თქვენს ინდივიდუალურობას. 10 წლიანი გამოცდილება ინტერიერის დიზაინსა და ავეჯის წარმოებაში.',
  image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
  linkFirst: '/projects',
  linkSecond: '/about',
};

export default function ImageTextSection({ blocks, pageTitle, pageDescription }: ImageTextSectionProps) {
  const block = blocks.find((b) => b.type === 'image_text');
  const title = String(block?.data?.title ?? pageTitle ?? DEFAULTS.title);
  const desc = String(block?.data?.textarea ?? pageDescription ?? DEFAULTS.desc);
  const image = block?.data?.image ? toBackendAssetUrl(String(block.data.image)) : DEFAULTS.image;
  const linkFirst = String(block?.data?.redairect_link_first ?? DEFAULTS.linkFirst);
  const linkSecond = String(block?.data?.redairect_link_second ?? DEFAULTS.linkSecond);

  return (
    <section className="py-5 bg-light overflow-hidden">
      <Container>
        <Row className="align-items-center gy-5">
          <Col lg={6}>
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="display-5 fw-bold mb-4">{title}</h2>
              <div className="lead text-muted mb-4" dangerouslySetInnerHTML={{ __html: desc }} />
              <div className="d-flex gap-3">
                <Button as={Link as any} href={linkFirst} variant="primary" size="lg" className="px-4">ჩვენს შესახებ</Button>
                <Button as={Link as any} href={linkSecond} variant="outline-primary" size="lg" className="px-4">პროექტები</Button>
              </div>
            </motion.div>
          </Col>
          <Col lg={6}>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
              <img
                src={image}
                alt={title}
                className="img-fluid rounded shadow-lg"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
