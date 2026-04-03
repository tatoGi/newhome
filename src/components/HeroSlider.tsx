'use client';

import React from 'react';
import { Button, Carousel, Container } from 'react-bootstrap';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useBootstrap } from '@/context/BootstrapContext';
import { getUiText } from '@/lib/i18n/ui';

type HeroSlide = {
  id?: string | number;
  title?: string;
  desc?: string;
  tag?: string;
  image?: string | null;
  link?: string;
};

const ChevronLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const HeroSlider: React.FC<{ data?: { slides?: HeroSlide[] } }> = ({ data }) => {

  const { locale } = useBootstrap();
  const displaySlides = Array.isArray(data?.slides) ? data.slides.filter(Boolean) : [];
  const hasMultipleSlides = displaySlides.length > 1;

  if (displaySlides.length === 0) {
    return null;
  }

  return (
    <section className="hero-slider" aria-label="Hero slider">
      <Carousel
        controls={hasMultipleSlides}
        indicators={hasMultipleSlides}
        interval={hasMultipleSlides ? 5000 : undefined}
        touch={hasMultipleSlides}
        pause={hasMultipleSlides ? 'hover' : false}
        wrap={hasMultipleSlides}
        slide={hasMultipleSlides}
        prevIcon={<span className="hero-slider-arrow"><ChevronLeft /></span>}
        nextIcon={<span className="hero-slider-arrow"><ChevronRight /></span>}
        prevLabel={getUiText(locale, 'hero.previous_slide')}
        nextLabel={getUiText(locale, 'hero.next_slide')}
      >
        {displaySlides.map((slide, index) => (
          <Carousel.Item key={slide.id ?? index}>
            <div className="hero-slide-image-container">
              {slide.image ? (
                <img
                  src={slide.image}
                  alt={slide.title || 'Banner'}
                  className="hero-slide-image"
                />
              ) : (
                <div className="hero-slide-fallback" />
              )}
            </div>

            <Carousel.Caption className="hero-slide-overlay">
              <Container>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="hero-slide-content d-flex flex-column align-items-center text-center mx-auto"
                >
                  {slide.tag ? (
                    <span className="hero-slide-tag">{slide.tag}</span>
                  ) : null}
                  {slide.title ? (
                    <h2 className="hero-slide-title">{slide.title}</h2>
                  ) : null}
                  {slide.desc ? (
                    <p className="hero-slide-desc">{slide.desc.replace(/<[^>]*>/g, '').trim()}</p>
                  ) : null}
                  <Button as={Link as any} href={slide.link || '/products'} variant="primary" className="hero-slide-btn rounded-pill">
                    {getUiText(locale, 'hero.discover_more')}
                  </Button>
                </motion.div>
              </Container>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
};

export default HeroSlider;
