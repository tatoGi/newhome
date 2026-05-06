'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import HeroSlider from '@/components/HeroSlider';
import FeaturesSection from '@/components/FeaturesSection';
import CtaBanner from '@/components/CtaBanner';
import { PageResponse, Block } from '@/lib/api/types';
import { resolveImageOrFallback } from '@/lib/api/assets';
import { useFallbackLogo } from '@/context/BootstrapContext';

const Reels = dynamic(() => import('@/components/Reels'));
const FeaturedProjects = dynamic(() => import('@/components/FeaturedProjects'));
const FeaturedProductsSection = dynamic(() => import('@/components/FeaturedProductsSection'));
const ImageTextSection = dynamic(() => import('@/components/ImageTextSection'));
const BlogSection = dynamic(() => import('@/components/BlogSection'));

interface HomePageProps {
  data: PageResponse | null;
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
    }));
}

export default function HomePage({ data }: HomePageProps) {

  const fallbackLogo = useFallbackLogo();
  const blocks = [...(data?.page?.blocks ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const heroSlides = buildHeroSlides(blocks, fallbackLogo);

  return (
    <div>
      {heroSlides.length > 0 && <HeroSlider data={{ slides: heroSlides }} />}

      <Reels data={{ reels: data?.relations?.reels || [] }} />

      <FeaturedProjects
        projects={data?.relations?.posts?.filter((p) => p.category === 'project')}
        projectSection={data?.project_section}
      />

      <FeaturesSection blocks={blocks} />

      <FeaturedProductsSection products={data?.relations?.products} />

      <ImageTextSection blocks={blocks} pageTitle={data?.page?.title} pageDescription={data?.page?.description} />

      <CtaBanner blocks={blocks} />

      <BlogSection blogSection={data?.blog_section} />
    </div>
  );
}
