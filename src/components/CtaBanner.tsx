'use client';

import { Container, Button } from 'react-bootstrap';
import Link from 'next/link';
import { Block } from '@/lib/api/types';

interface CtaBannerProps {
  blocks: Block[];
}

const pickDefined = (...values: unknown[]): string => {
  const value = values.find((item) => item !== null && item !== undefined);

  return String(value ?? '');
};

export default function CtaBanner({ blocks }: CtaBannerProps) {
  const block = blocks.find((b) => b.type === 'cta_banner');
  if (!block) return null;

  const title = pickDefined(block.data?.title);
  const desc = pickDefined(block.data?.description, block.data?.banner_desc);
  const href = String(block.data?.cta_url ?? block.data?.redairect_link ?? '/contact');

  return (
    <section className="py-5 mb-5">
      <Container>
        <div className="bg-primary text-white p-5 rounded-4 text-center position-relative overflow-hidden shadow-lg">
          <div className="position-relative z-1">
            {title ? <h2 className="display-6 fw-bold mb-3" dangerouslySetInnerHTML={{ __html: title }} /> : null}
            {desc ? <div className="mb-4 opacity-75 lead" dangerouslySetInnerHTML={{ __html: desc }} /> : null}
            <Button as={Link as any} href={href} variant="light" size="lg" className="px-5 text-primary fw-bold text-uppercase">კონსულტაცია</Button>
          </div>
          <div className="position-absolute top-50 start-50 translate-middle bg-white opacity-10 rounded-circle" style={{ width: '800px', height: '800px', zIndex: 0, filter: 'blur(50px)' }} />
        </div>
      </Container>
    </section>
  );
}
