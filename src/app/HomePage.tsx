'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import HeroSlider from '@/components/HeroSlider';
import FeaturesSection from '@/components/FeaturesSection';
import CtaBanner from '@/components/CtaBanner';
import { PageResponse, Block } from '@/lib/api/types';
import { resolveImageOrFallback, toBackendAssetUrl } from '@/lib/api/assets';
import { useFallbackLogo } from '@/context/BootstrapContext';

const Reels = dynamic(() => import('@/components/Reels'));
const FeaturedProjects = dynamic(() => import('@/components/FeaturedProjects'));
const FeaturedProductsSection = dynamic(() => import('@/components/FeaturedProductsSection'));
const ImageTextSection = dynamic(() => import('@/components/ImageTextSection'));
const BlogSection = dynamic(() => import('@/components/BlogSection'));

interface HomePageProps {
  data: PageResponse | null;
}
const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|ogv|avi|m4v)(\?.*)?$/i;
const isVideoPath = (value: unknown) => VIDEO_EXTENSIONS.test(String(value ?? ''));

function buildHeroSlides(blocks: Block[], fallbackLogo: string) {
  return blocks
    .filter((b) => b.type === 'main_banner' || b.type === 'page_hero' || b.type === 'banner')
    .map((b, i) => {
      const rawVideo = b.data.background_video ?? b.data.banner_video ?? b.data.video;
      const rawImage = b.data.banner_image ?? b.data.image;
      const imageIsVideo = isVideoPath(rawImage);

      const videoSource = rawVideo || (imageIsVideo ? rawImage : '');
      const imageSource = imageIsVideo ? '' : rawImage;
      const video = videoSource ? toBackendAssetUrl(videoSource) : '';

      return {
        id: `${b.type}-${i}`,
        title: String(b.data.banner_title ?? b.data.title ?? b.label ?? ''),
        desc: String(b.data.banner_description ?? b.data.banner_desc ?? b.data.description ?? b.description ?? ''),
        image: resolveImageOrFallback(imageSource, fallbackLogo),
        video: video || undefined,
        link: String(b.data.redirect_link ?? b.data.cta_primary_url ?? b.data.banner_link ?? b.data.link ?? '/products'),
      };
    });
}

export default function HomePage({ data }: HomePageProps) {

  const fallbackLogo = useFallbackLogo();
  const blocks = [...(data?.page?.blocks ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const heroSlides = buildHeroSlides(blocks, fallbackLogo);

  return (
    <div>
      {heroSlides.length > 0 && <HeroSlider data={{ slides: heroSlides }} />}

      <Reels data={{ reels: data?.relations?.reels || [] }} />

      <FeaturesSection blocks={blocks} />

      <FeaturedProductsSection
        products={data?.relations?.products}
        title={(() => {
          const b = blocks.find((b) => b.type === 'featured_products' || b.type === 'products_section');
          return b ? String(b.data?.title ?? b.data?.section_title ?? '') : '';
        })()}
        subtitle={(() => {
          const b = blocks.find((b) => b.type === 'featured_products' || b.type === 'products_section');
          return b ? String(b.data?.subtitle ?? b.data?.section_subtitle ?? '') : '';
        })()}
      />

      <FeaturedProjects
        projects={data?.relations?.posts?.filter((p) => p.category === 'project')}
        projectSection={data?.project_section}
      />

      <BlogSection blogSection={data?.blog_section} />
      <ImageTextSection blocks={blocks} pageTitle={data?.page?.title} pageDescription={data?.page?.description} />

      <CtaBanner blocks={blocks} />

    </div>
  );
}
