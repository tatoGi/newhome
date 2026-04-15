'use client';

import { Block } from '@/lib/api/types';
import HeroSlider from '@/components/HeroSlider';
import FeaturesSection from '@/components/FeaturesSection';
import ImageTextSection from '@/components/ImageTextSection';
import CtaBanner from '@/components/CtaBanner';
import { toBackendAssetUrl } from '@/lib/api/assets';
import { Container, Row, Col } from 'react-bootstrap';

interface Props {
  blocks: Block[];
  pageTitle?: string;
  pageDescription?: string;
}

function buildHeroSlides(blocks: Block[]) {
  return blocks
    .filter((b) => b.type === 'main_banner' || b.type === 'page_hero' || b.type === 'banner')
    .map((b, i) => ({
      id: `${b.type}-${i}`,
      title: String(b.data.banner_title ?? b.data.title ?? b.label ?? ''),
      desc: String(b.data.banner_description ?? b.data.banner_desc ?? b.data.description ?? b.description ?? ''),
      image: toBackendAssetUrl(String(b.data.banner_image ?? b.data.image ?? '')),
      link: String(b.data.redirect_link ?? b.data.cta_primary_url ?? b.data.banner_link ?? b.data.link ?? '/products'),
    }));
}

function PhotoGallery({ blocks }: { blocks: Block[] }) {
  const galleryBlocks = blocks.filter((b) => b.type === 'photo_gallery');
  if (galleryBlocks.length === 0) return null;

  const images: string[] = galleryBlocks.flatMap((b) => {
    const imgs = b.data.images ?? b.data.gallery ?? [];
    return Array.isArray(imgs) ? imgs.map((img: unknown) => toBackendAssetUrl(String(img ?? '')) ?? '').filter(Boolean) : [];
  });

  if (images.length === 0) return null;

  return (
    <section className="py-5">
      <Container>
        <Row className="gy-3">
          {images.map((src, i) => (
            <Col key={i} xs={6} md={4} lg={3}>
              <img src={src} alt={`gallery-${i}`} className="img-fluid rounded shadow-sm w-100" style={{ height: '200px', objectFit: 'cover' }} referrerPolicy="no-referrer" />
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

export default function PageBlockRenderer({ blocks, pageTitle, pageDescription }: Props) {
  if (!blocks || blocks.length === 0) return null;

  const sorted = [...blocks].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const heroSlides = buildHeroSlides(sorted);

  const hasHero = heroSlides.length > 0;
  const hasItemsGrid = sorted.some((b) => b.type === 'items_grid');
  const hasImageText = sorted.some((b) => b.type === 'image_text');
  const hasCtaBanner = sorted.some((b) => b.type === 'cta_banner');
  const hasGallery = sorted.some((b) => b.type === 'photo_gallery');
  const hasProcessSteps = sorted.some((b) => b.type === 'process_steps');

  return (
    <>
      {hasHero && <HeroSlider data={{ slides: heroSlides }} />}
      {hasItemsGrid && <FeaturesSection blocks={sorted} />}
      {hasImageText && <ImageTextSection blocks={sorted} pageTitle={pageTitle} pageDescription={pageDescription} />}
      {hasProcessSteps && <ProcessSteps blocks={sorted} />}
      {hasGallery && <PhotoGallery blocks={sorted} />}
      {hasCtaBanner && <CtaBanner blocks={sorted} />}
    </>
  );
}
