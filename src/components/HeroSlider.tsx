'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useBootstrap, useFallbackLogo } from '@/context/BootstrapContext';
import { getUiText } from '@/lib/i18n/ui';
import { resolveImageOrFallback } from '@/lib/api/assets';

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

const stripHtml = (value?: string) => String(value ?? '').replace(/<[^>]*>/g, '').trim();

const HeroSlider: React.FC<{ data?: { slides?: HeroSlide[] } }> = ({ data }) => {
  const { locale } = useBootstrap();
  const fallbackLogo = useFallbackLogo();
  const displaySlides = Array.isArray(data?.slides) ? data.slides.filter(Boolean) : [];
  const [activeIndex, setActiveIndex] = React.useState(0);

  if (displaySlides.length === 0) {
    return null;
  }

  const hasMultipleSlides = displaySlides.length > 1;
  const activeSlide = displaySlides[Math.min(activeIndex, displaySlides.length - 1)] ?? displaySlides[0];
  const slideImage = resolveImageOrFallback(activeSlide.image, fallbackLogo);
  const title = activeSlide.title || '';
  const description = stripHtml(activeSlide.desc);

  const goTo = (nextIndex: number) => {
    setActiveIndex((nextIndex + displaySlides.length) % displaySlides.length);
  };

  return (
    <section className="hero-slider" aria-label="Hero slider">
      <div className="hero-slider-frame">
        <div className="hero-slide-image-container">
          <Image
            src={slideImage}
            alt={title || 'Banner'}
            title={title || 'Banner'}
            fill
            priority
            fetchPriority="high"
            loading="eager"
            sizes="100vw"
            quality={68}
            className="hero-slide-image"
          />
        </div>

        <div className="hero-slide-overlay">
          <div className="container">
            <div className="hero-slide-content d-flex flex-column align-items-center text-center mx-auto">
              {activeSlide.tag ? <span className="hero-slide-tag">{activeSlide.tag}</span> : null}
              {title && activeIndex === 0 ? (
                <h1 className="hero-slide-title">{title}</h1>
              ) : title ? (
                <h2 className="hero-slide-title">{title}</h2>
              ) : null}
              {description ? <p className="hero-slide-desc">{description}</p> : null}
              <Link href={activeSlide.link || '/products'} className="btn btn-primary hero-slide-btn rounded-pill">
                {getUiText(locale, 'hero.discover_more')}
              </Link>
            </div>
          </div>
        </div>

        {hasMultipleSlides && (
          <>
            <button
              type="button"
              className="hero-slider-control hero-slider-control-prev"
              aria-label={getUiText(locale, 'hero.previous_slide')}
              onClick={() => goTo(activeIndex - 1)}
            >
              <span className="hero-slider-arrow"><ChevronLeft /></span>
            </button>
            <button
              type="button"
              className="hero-slider-control hero-slider-control-next"
              aria-label={getUiText(locale, 'hero.next_slide')}
              onClick={() => goTo(activeIndex + 1)}
            >
              <span className="hero-slider-arrow"><ChevronRight /></span>
            </button>
            <div className="hero-slider-indicators" aria-label="Hero slide navigation">
              {displaySlides.map((slide, index) => (
                <button
                  key={slide.id ?? index}
                  type="button"
                  className={index === activeIndex ? 'active' : ''}
                  aria-label={`Slide ${index + 1}`}
                  aria-current={index === activeIndex}
                  onClick={() => goTo(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroSlider;
