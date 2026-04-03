'use client';

import React from 'react';
import { Container, Button } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Block } from '@/lib/api/types';

interface CtaBannerProps {
  blocks: Block[];
}

const DEFAULTS = {
  title: 'გსურთ ინდივიდუალური შეკვეთა?',
  desc: 'დაგვიკავშირდით და ჩვენი დიზაინერები დაგეხმარებიან იდეალური სივრცის შექმნაში',
  link: '/contact',
};

export default function CtaBanner({ blocks }: CtaBannerProps) {
  const block = blocks.find((b) => b.type === 'cta_banner');
  const title = String(block?.data?.title ?? DEFAULTS.title);
  const desc = String(block?.data?.banner_desc ?? DEFAULTS.desc);
  const href = String(block?.data?.redairect_link ?? DEFAULTS.link);

  return (
    <section className="py-5 mb-5">
      <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-primary text-white p-5 rounded-4 text-center position-relative overflow-hidden shadow-lg"
        >
          <div className="position-relative z-1">
            <h2 className="display-6 fw-bold mb-3">{title}</h2>
            <p className="mb-4 opacity-75 lead">{desc}</p>
            <Button as={Link as any} href={href} variant="light" size="lg" className="px-5 text-primary fw-bold text-uppercase">კონსულტაცია</Button>
          </div>
          <div className="position-absolute top-50 start-50 translate-middle bg-white opacity-10 rounded-circle" style={{ width: '800px', height: '800px', zIndex: 0, filter: 'blur(50px)' }} />
        </motion.div>
      </Container>
    </section>
  );
}
