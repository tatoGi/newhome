'use client';

import { Block } from '@/lib/api/types';
import HeroSlider from '@/components/HeroSlider';
import FeaturesSection from '@/components/FeaturesSection';
import ImageTextSection from '@/components/ImageTextSection';
import CtaBanner from '@/components/CtaBanner';
import { resolveImageOrFallback } from '@/lib/api/assets';
import { useFallbackLogo } from '@/context/BootstrapContext';
import { Container, Row, Col } from 'react-bootstrap';

interface Props {
  blocks: Block[];
  pageTitle?: string;
  pageDescription?: string;
}

function buildHeroSlides(blocks: Block[], fallbackLogo: string) {
  return blocks
    .filter((b) => b.type === 'main_banner' || b.type === 'page_hero' || b.type === 'banner')
    .map((b, i) => ({
      id: `${b.type}-${i}`,
      title: String(b.data.banner_title ?? b.data.title ?? b.label ?? ''),
      desc: String(b.data.banner_description ?? b.data.banner_desc ?? b.data.description ?? b.description ?? ''),
      image: resolveImageOrFallback(b.data.banner_image ?? b.data.image, fallbackLogo),
      link: String(b.data.redirect_link ?? b.data.cta_primary_url ?? b.data.banner_link ?? b.data.link ?? '/products'),
      imageFit: String(b.data.image_fit ?? 'cover'),
    }));
}

function PhotoGallery({ blocks, fallbackLogo }: { blocks: Block[]; fallbackLogo: string }) {
  const galleryBlocks = blocks.filter((b) => b.type === 'photo_gallery');
  if (galleryBlocks.length === 0) return null;

  const images: string[] = galleryBlocks.flatMap((b) => {
    const imgs = b.data.images ?? b.data.gallery ?? [];
    return Array.isArray(imgs) ? imgs.map((img: unknown) => resolveImageOrFallback(img, fallbackLogo)) : [];
  });

  if (images.length === 0) return null;

  return (
    <section className="py-5">
      <Container>
        <Row className="gy-3">
          {images.map((src, i) => (
            <Col key={i} xs={6} md={4} lg={3}>
              <img src={src} alt={`gallery-${i}`} title={`gallery-${i}`} className="img-fluid rounded shadow-sm w-100" style={{ height: '200px', objectFit: 'cover' }} referrerPolicy="no-referrer" />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

function ProcessSteps({ blocks }: { blocks: Block[] }) {
  const stepBlocks = blocks.filter((b) => b.type === 'process_steps');
  if (stepBlocks.length === 0) return null;

  // Each process block has a 'steps' repeater field: [{title, description}]
  const allSteps: Array<{ title: string; desc: string }> = stepBlocks.flatMap((b) => {
    const steps = b.data.steps;
    if (Array.isArray(steps) && steps.length > 0) {
      return steps.map((s: any) => ({
        title: String(s?.title ?? ''),
        desc: String(s?.description ?? s?.subtitle ?? ''),
      }));
    }
    return [];
  });

  if (allSteps.length === 0) return null;

  return (
    <section className="py-5 bg-light">
      <Container>
        <Row className="gy-4">
          {allSteps.map((step, i) => (
            <Col key={i} md={4} className="text-center">
              <div className="p-4 bg-white rounded shadow-sm h-100">
                <div className="fw-bold fs-1 text-primary mb-3">{i + 1}</div>
                <h5 className="fw-bold">{step.title}</h5>
                <p className="text-muted small mb-0">{step.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
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

function ChecklistBlocks({ blocks }: { blocks: Block[] }) {
  const checklistBlocks = blocks.filter((b) => b.type === 'checklist' || b.type === 'post_checklist');
  if (checklistBlocks.length === 0) return null;

  return (
    <section className="py-4">
      <Container>
        {checklistBlocks.map((block, blockIndex) => {
          const items = extractChecklistItems(block.data ?? {});
          if (items.length === 0) return null;
          const title = String(block.data?.title ?? '').trim();

          return (
            <div key={`checklist-${blockIndex}`} className="mb-4">
              {title ? <h3 className="h4 fw-bold mb-3">{title}</h3> : null}
              <ul className="ps-3 mb-0">
                {items.map((item, itemIndex) => (
                  <li key={`checklist-item-${itemIndex}`} className="mb-2 text-muted">{item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </Container>
    </section>
  );
}

function QuoteBlocks({ blocks }: { blocks: Block[] }) {
  const quoteBlocks = blocks.filter((b) => b.type === 'quote' || b.type === 'post_quote');
  if (quoteBlocks.length === 0) return null;

  return (
    <section className="py-5">
      <Container>
        {quoteBlocks.map((block, blockIndex) => {
          const quote = String(block.data?.quote ?? block.data?.text ?? block.data?.content ?? '').trim();
          const author = String(block.data?.author ?? block.data?.name ?? '').trim();
          if (!quote) return null;

          return (
            <figure
              key={`quote-${blockIndex}`}
              className="position-relative mx-auto my-4 px-4 px-md-5 py-4 py-md-5 rounded-4 shadow-sm bg-white"
              style={{ maxWidth: 820, borderLeft: '6px solid var(--bs-primary)' }}
            >
              <span
                aria-hidden="true"
                className="position-absolute lh-1 text-primary opacity-25"
                style={{ top: '-12px', left: '20px', fontSize: '5rem', fontFamily: 'Georgia, serif' }}
              >
                &ldquo;
              </span>
              <blockquote className="mb-0">
                <div
                  className="cms-content fst-italic text-dark lh-lg fs-4 mb-0"
                  dangerouslySetInnerHTML={{ __html: quote }}
                />
              </blockquote>
              {author && (
                <figcaption className="mt-3 d-flex align-items-center gap-2 text-muted small fw-semibold text-uppercase">
                  <span className="d-inline-block bg-primary" style={{ width: 28, height: 2 }} />
                  {author}
                </figcaption>
              )}
            </figure>
          );
        })}
      </Container>
    </section>
  );
}

function PostIntroBlocks({ blocks, fallbackLogo }: { blocks: Block[]; fallbackLogo: string }) {
  const introBlocks = blocks.filter((b) => b.type === 'post_intro');
  if (introBlocks.length === 0) return null;

  return (
    <section className="py-4">
      <Container>
        {introBlocks.map((block, blockIndex) => {
          const category = String(block.data?.category ?? '').trim();
          const readTime = String(block.data?.read_time ?? '').trim();
          const introText = String(block.data?.intro_text ?? block.data?.post_text ?? '').trim();
          const rawImage = String(block.data?.intro_image ?? block.data?.post_image ?? '').trim();
          const introImage = rawImage ? resolveImageOrFallback(rawImage, fallbackLogo) : '';

          if (!category && !readTime && !introText && !introImage) return null;

          return (
            <div key={`post-intro-${blockIndex}`} className="mb-4">
              {(category || readTime) && (
                <div className="d-flex gap-3 mb-3 small text-muted align-items-center">
                  {category && <span className="badge bg-primary-subtle text-primary px-3 py-2">{category}</span>}
                  {readTime && <span className="d-inline-flex align-items-center">{readTime}</span>}
                </div>
              )}
              <Row className="gy-4 align-items-start">
                <Col lg={introImage ? 7 : 12}>
                  {introText && (
                    <div className="cms-content text-muted lh-lg fs-5" dangerouslySetInnerHTML={{ __html: introText }} />
                  )}
                </Col>
                {introImage && (
                  <Col lg={5}>
                    <img
                      src={introImage}
                      alt=""
                      className="img-fluid rounded shadow-sm w-100"
                      style={{ maxHeight: 420, objectFit: 'cover' }}
                      referrerPolicy="no-referrer"
                    />
                  </Col>
                )}
              </Row>
            </div>
          );
        })}
      </Container>
    </section>
  );
}

export default function PageBlockRenderer({ blocks, pageTitle, pageDescription }: Props) {
  const fallbackLogo = useFallbackLogo();

  if (!blocks || blocks.length === 0) return null;

  const sorted = [...blocks].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const heroSlides = buildHeroSlides(sorted, fallbackLogo);

  const hasHero = heroSlides.length > 0;
  const hasItemsGrid = sorted.some((b) => b.type === 'items_grid');
  const hasImageText = sorted.some((b) => b.type === 'image_text');
  const hasCtaBanner = sorted.some((b) => b.type === 'cta_banner');
  const hasGallery = sorted.some((b) => b.type === 'photo_gallery');
  const hasProcessSteps = sorted.some((b) => b.type === 'process_steps');
  const hasChecklist = sorted.some((b) => b.type === 'checklist' || b.type === 'post_checklist');
  const hasQuote = sorted.some((b) => b.type === 'quote' || b.type === 'post_quote');
  const hasPostIntro = sorted.some((b) => b.type === 'post_intro');

  return (
    <>
      {hasHero && <HeroSlider data={{ slides: heroSlides }} />}
      {hasPostIntro && <PostIntroBlocks blocks={sorted} fallbackLogo={fallbackLogo} />}
      {hasItemsGrid && <FeaturesSection blocks={sorted} />}
      {hasImageText && <ImageTextSection blocks={sorted} pageTitle={pageTitle} pageDescription={pageDescription} />}
      {hasProcessSteps && <ProcessSteps blocks={sorted} />}
      {hasGallery && <PhotoGallery blocks={sorted} fallbackLogo={fallbackLogo} />}
      {hasChecklist && <ChecklistBlocks blocks={sorted} />}
      {hasQuote && <QuoteBlocks blocks={sorted} />}
      {hasCtaBanner && <CtaBanner blocks={sorted} />}
    </>
  );
}
