'use client';

import React from 'react';
import HeroSlider from '@/components/HeroSlider';
import Reels from '@/components/Reels';
import FeaturedProjects from '@/components/FeaturedProjects';
import FeaturesSection from '@/components/FeaturesSection';
import FeaturedProductsSection from '@/components/FeaturedProductsSection';
import ImageTextSection from '@/components/ImageTextSection';
import CtaBanner from '@/components/CtaBanner';
import BlogSection from '@/components/BlogSection';
import { PageResponse, Block } from '@/lib/api/types';
import { toBackendAssetUrl } from '@/lib/api/assets';

interface HomePageProps {
  data: PageResponse | null;
}

function buildHeroSlides(blocks: Block[]) {
  return blocks
    .filter((b) => b.type === 'main_banner' || b.type === 'page_hero' || b.type === 'banner')
    .map((b, i) => ({
      id: `${b.type}-${i}`,
      title: String(b.data.banner_title ?? b.data.title ?? b.label ?? ''),
      desc: String(b.data.banner_desc ?? b.data.banner_description ?? b.data.description ?? b.description ?? ''),
      image: toBackendAssetUrl(String(b.data.banner_image ?? b.data.image ?? '')),
      link: String(b.data.banner_link ?? b.data.link ?? '/products'),
    }));
}

export default function HomePage({ data }: HomePageProps) {
  const blocks = [...(data?.page?.blocks ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const heroSlides = buildHeroSlides(blocks);

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
