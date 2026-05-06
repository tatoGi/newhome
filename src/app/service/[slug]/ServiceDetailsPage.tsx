'use client';

import { Container, Row, Col } from 'react-bootstrap';
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

function extractChecklistItems(data: Record<string, any> = {}): string[] {
  const items = data.items;
  if (Array.isArray(items) && items.length > 0) {
    return items
      .map((item) => {
        if (typeof item === 'string') return item.trim();
        if (item && typeof item === 'object') {
          return String(item.title ?? item.label ?? item.text ?? item.value ?? '').trim();
        }
        return '';
      })
      .filter(Boolean);
  }

  return [1, 2, 3, 4, 5, 6]
    .map((index) => String(data[`item_${index}`] ?? data[`item_${index}_title`] ?? '').trim())
    .filter(Boolean);
}

const stripHtml = (value: unknown): string =>
  String(value ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export default function ServiceDetailsPage({ service, phone }: { service: ServiceProps; phone?: string | null }) {
  const fallbackLogo = useFallbackLogo();
  const intro = service.blocks?.find((b: any) => b.type === 'post_intro');
  const hasContentImage = Boolean(intro?.data?.post_image || service.coverImage || service.image);
  const heroImage = resolveImageOrFallback(
    intro?.data?.post_image || service.coverImage || service.image || '',
    fallbackLogo
  );
  const title = intro?.data?.title || service.title;
  const desc = intro?.data?.post_text || service.desc;
  const extraBlocks = (service.blocks ?? []).filter(
    (b: any) => b.type !== 'post_intro'
  );
  const checklistBlocks = extraBlocks.filter((b: any) => b.type === 'checklist' || b.type === 'post_checklist');
  const quoteBlocks = extraBlocks.filter((b: any) => b.type === 'quote' || b.type === 'post_quote');
  const layoutBlocks = extraBlocks.filter(
    (b: any) => b.type !== 'checklist' && b.type !== 'post_checklist' && b.type !== 'quote' && b.type !== 'post_quote'
  );
  const fullDescText = stripHtml(service.fullDesc);
  const descText = stripHtml(desc);
  const shouldShowFullDesc = Boolean(
    fullDescText &&
    fullDescText !== descText &&
    fullDescText !== stripHtml(title)
  );

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
          {/* Breadcrumb */}
          <div className="mb-5 d-flex align-items-center text-muted small border-bottom pb-3">
            <Link href="/" className="text-muted text-decoration-none">მთავარი</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link href="/services" className="text-muted text-decoration-none">სერვისები</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-dark fw-medium">{title}</span>
          </div>

          {layoutBlocks.length > 0 && (
            <div className="mb-5">
              <PageBlockRenderer blocks={layoutBlocks} pageTitle={title} pageDescription={desc} />
            </div>
          )}

          {checklistBlocks.length > 0 && (
            <div className="mb-5">
              {checklistBlocks.map((block: any, blockIndex: number) => {
                const items = extractChecklistItems(block?.data ?? {});
                if (items.length === 0) return null;
                return (
                  <div key={`checklist-${blockIndex}`} className="mb-4">
                    <h3 className="h4 fw-bold mb-3">{String(block?.data?.title ?? 'ჩეკლისტი')}</h3>
                    <ul className="ps-3 mb-0">
                      {items.map((item, itemIndex) => (
                        <li key={`checklist-item-${itemIndex}`} className="mb-2 text-muted">{item}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}

          {quoteBlocks.length > 0 && (
            <div className="mb-5">
              {quoteBlocks.map((block: any, blockIndex: number) => {
                const quote = String(block?.data?.quote ?? block?.data?.text ?? block?.data?.content ?? '').trim();
                const author = String(block?.data?.author ?? block?.data?.name ?? '').trim();
                if (!quote) return null;
                return (
                  <blockquote key={`quote-${blockIndex}`} className="border-start border-4 ps-3 py-2 mb-3 bg-light rounded">
                    <p className="mb-2 fst-italic">{quote}</p>
                    {author ? <footer className="text-muted small">- {author}</footer> : null}
                  </blockquote>
                );
              })}
            </div>
          )}

          <Row className="gy-5 align-items-start">
            <Col lg={hasContentImage ? 7 : 12}>
              {desc ? (
                <div
                  className="cms-content text-muted lh-lg fs-5 mb-4"
                  dangerouslySetInnerHTML={{ __html: desc }}
                />
              ) : null}

              {shouldShowFullDesc ? (
                <div
                  className="cms-content text-muted lh-lg fs-5"
                  dangerouslySetInnerHTML={{ __html: service.fullDesc }}
                />
              ) : null}
            </Col>

            {hasContentImage && (
              <Col lg={5}>
                <img
                  src={heroImage}
                  alt={title}
                  title={title}
                  className="img-fluid rounded shadow-sm w-100"
                  style={{ maxHeight: 420, objectFit: 'cover' }}
                  referrerPolicy="no-referrer"
                />
              </Col>
            )}
          </Row>
        </div>
      </Container>
    </div>
  );
}
