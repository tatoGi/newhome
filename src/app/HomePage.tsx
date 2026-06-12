'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import HeroSlider from '@/components/HeroSlider';
import { PageResponse, Block } from '@/lib/api/types';
import { resolveImageOrFallback, toBackendAssetUrl } from '@/lib/api/assets';
import { useFallbackLogo } from '@/context/BootstrapContext';

const Reels = dynamic(() => import('@/components/Reels'));
const FeaturedProjects = dynamic(() => import('@/components/FeaturedProjects'));
const FeaturedProductsSection = dynamic(() => import('@/components/FeaturedProductsSection'));
const BlogSection = dynamic(() => import('@/components/BlogSection'));
const PageBlockRenderer = dynamic(() => import('@/components/PageBlockRenderer'));

interface HomePageProps {
  data: PageResponse | null;
}

const HERO_TYPES = ['main_banner', 'page_hero', 'banner'];
const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|ogv|avi|m4v)(\?.*)?$/i;
const isVideoPath = (value: unknown) => VIDEO_EXTENSIONS.test(String(value ?? ''));

function buildHeroSlides(blocks: Block[], fallbackLogo: string) {
  return blocks
    .filter((b) => HERO_TYPES.includes(b.type))
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

  // Every non-hero content block renders generically, in its admin sort_order.
  const contentBlocks = blocks.filter((b) => !HERO_TYPES.includes(b.type));

  const productsTitleBlock = blocks.find((b) => b.type === 'featured_products' || b.type === 'products_section');

  return (
    <div>
      {heroSlides.length > 0 && <HeroSlider data={{ slides: heroSlides }} />}

      <Reels data={{ reels: data?.relations?.reels || [] }} />

      <PageBlockRenderer
        blocks={contentBlocks}
        pageTitle={data?.page?.title}
        pageDescription={data?.page?.description}
      />

      <FeaturedProductsSection
        products={data?.relations?.products}
        title={productsTitleBlock ? String(productsTitleBlock.data?.title ?? productsTitleBlock.data?.section_title ?? '') : ''}
        subtitle={productsTitleBlock ? String(productsTitleBlock.data?.subtitle ?? productsTitleBlock.data?.section_subtitle ?? '') : ''}
      />

      <FeaturedProjects
        projects={data?.relations?.posts?.filter((p) => p.category === 'project')}
        projectSection={data?.project_section}
      />

      <BlogSection blogSection={data?.blog_section} />
    </div>
  );
}
