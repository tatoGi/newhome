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
  image?: string | null;
  link?: string;
};

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
        prevIcon={<span className="hero-slider-arrow" aria-hidden="true">{'<'}</span>}
        nextIcon={<span className="hero-slider-arrow" aria-hidden="true">{'>'}</span>}
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="hero-slide-content d-flex flex-column align-items-center text-center mx-auto"
                >
                  {slide.title ? <h2 className="display-6 fw-bold mb-3">{slide.title}</h2> : null}
                  {slide.desc ? <p className="fs-5 mb-4 opacity-75">{slide.desc}</p> : null}
                  <Button as={Link as any} href={slide.link || '/products'} variant="primary" className="px-5 py-2 rounded-pill">
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
