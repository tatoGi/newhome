'use client';

import { useState } from 'react';
import { Container, Row, Col, Card, Badge, Breadcrumb, Button } from 'react-bootstrap';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { allProjects } from '@/lib/data';
import { Block, PostRelation } from '@/lib/api/types';
import { toBackendAssetUrl } from '@/lib/api/assets';
import { slugify } from '@/lib/slugify';

interface ProjectsPageProps {
  posts?: PostRelation[];
  pageTitle?: string;
  pageDescription?: string;
  blocks?: Block[];
}

export default function ProjectsPage({ posts, pageTitle, pageDescription, blocks }: ProjectsPageProps) {
  const heroBlock = [...(blocks ?? [])]
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .find((block) => block.type === 'page_hero' || block.type === 'main_banner' || block.type === 'banner');

  const heroTitle = String(heroBlock?.data?.banner_title ?? heroBlock?.data?.title ?? pageTitle ?? 'პროექტები');
  const heroDescription = String(
    heroBlock?.data?.banner_desc ??
    heroBlock?.data?.banner_description ??
    heroBlock?.data?.description ??
    pageDescription ??
    ''
  );
  const heroImage = toBackendAssetUrl(heroBlock?.data?.banner_image ?? heroBlock?.data?.image ?? '');

  const allItems = posts && posts.length > 0
    ? posts.map((post) => {
      const intro = post.blocks?.find((b) => b.type === 'post_intro');
      const rawImage = intro?.data?.post_image || post.feature_image || '';
      return {
        id: post.id,
        slug: post.slug,
        title: intro?.data?.title || post.title,
        image: toBackendAssetUrl(rawImage) || '',
        category: post.category || '',
        publishedAt: post.published_at,
        excerpt: post.excerpt,
      };
    })
    : allProjects.map((project) => ({
      id: project.id,
      slug: String(project.id),
      title: project.title,
      image: project.image,
      category: project.category || '',
      publishedAt: project.year,
      excerpt: project.location,
    }));

  const categories = ['ყველა', ...Array.from(new Set(allItems.map((p) => p.category).filter(Boolean)))];
  const [activeCategory, setActiveCategory] = useState('ყველა');

  const projects = activeCategory === 'ყველა'
    ? allItems
    : allItems.filter((p) => p.category === activeCategory);

  return (
    <Container className="py-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">მთავარი</Breadcrumb.Item>
        <Breadcrumb.Item active>{heroTitle}</Breadcrumb.Item>
      </Breadcrumb>

      {heroImage ? (
        <div
          className="position-relative overflow-hidden rounded-4 mb-4"
          style={{ minHeight: '260px', backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.42), rgba(0,0,0,0.18))' }} />
          <div className="position-relative text-white d-flex flex-column justify-content-end h-100 p-4 p-md-5">
            <h1 className="fw-bold display-5 mb-2">{heroTitle}</h1>
            {heroDescription ? <div className="mb-0 opacity-75" style={{ maxWidth: '720px' }} dangerouslySetInnerHTML={{ __html: heroDescription }} /> : null}
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <h1 className="fw-bold mb-2">{heroTitle}</h1>
          {heroDescription ? <div className="text-muted mb-0" dangerouslySetInnerHTML={{ __html: heroDescription }} /> : null}
        </div>
      )}

      {categories.length > 1 && (
        <div className="d-flex flex-wrap gap-2 mb-5">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'primary' : 'outline-secondary'}
              size="sm"
              className="rounded-pill px-3"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      )}

      <Row className="gy-4">
        <AnimatePresence mode="wait">
          {projects.map((project, index) => (
            <Col key={project.id} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.07 }}
              >
                <Card className="border-0 shadow-sm overflow-hidden">
                  <div className="position-relative overflow-hidden">
                    <Link href={`/project/${slugify(project.slug)}`}>
                      {project.image ? (
                        <Card.Img variant="top" src={project.image} style={{ height: '400px', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                      ) : (
                        <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
                          <span className="text-muted small">სურათი არ არის</span>
                        </div>
                      )}
                    </Link>
                    {project.category && (
                      <div className="position-absolute top-0 start-0 m-3">
                        <Badge bg="primary" className="px-3 py-2">{project.category}</Badge>
                      </div>
                    )}
                  </div>
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Link href={`/project/${slugify(project.slug)}`} className="fw-bold fs-4 mb-0 text-dark text-decoration-none">
                        {project.title}
                      </Link>
                      {project.publishedAt && <span className="text-primary fw-bold">{project.publishedAt}</span>}
                    </div>
                    {project.excerpt && (
                      <div className="text-muted mb-0" dangerouslySetInnerHTML={{ __html: project.excerpt }} />
                    )}
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </AnimatePresence>
      </Row>
    </Container>
  );
}
