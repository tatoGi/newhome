'use client';

import { Container } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { resolveImageOrFallback } from '@/lib/api/assets';
import { useFallbackLogo } from '@/context/BootstrapContext';
import PageBlockRenderer from '@/components/PageBlockRenderer';

interface ServiceProps {
  id: number;
  slug: string;
  title: string;
  desc: string;
  fullDesc: string;
  coverImage: string;
  image: string;
  blocks: any[];
}

export default function ServiceDetailsPage({ service }: { service: ServiceProps; phone?: string | null }) {
  const fallbackLogo = useFallbackLogo();
  const heroImage = resolveImageOrFallback(
    service.coverImage || service.image || '',
    fallbackLogo
  );
  const title = service.title;
  const desc = service.desc;
  const postBlocks = service.blocks ?? [];

  return (
    <div className="pb-5 bg-light min-vh-100">
      <div
        className="position-relative d-flex align-items-center justify-content-center"
        style={{
          minHeight: '380px',
          backgroundImage: `url(${heroImage})`,
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
          <div className="mb-5 d-flex align-items-center text-muted small border-bottom pb-3">
            <Link href="/" className="text-muted text-decoration-none">მთავარი</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link href="/services" className="text-muted text-decoration-none">სერვისები</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-dark fw-medium">{title}</span>
          </div>

          {postBlocks.length > 0 && (
            <PageBlockRenderer blocks={postBlocks} pageTitle={title} pageDescription={desc} />
          )}
        </div>
      </Container>
    </div>
  );
}
