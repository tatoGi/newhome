'use client';

import React from 'react';
import { Container, Row, Col, Card, Badge, Breadcrumb, Button } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'motion/react';
import { allProjects } from '@/lib/data';
import { Block, PostRelation } from '@/lib/api/types';
import { toBackendAssetUrl } from '@/lib/api/assets';
import { slugify } from '@/lib/slugify';
import { p } from 'motion/react-client';

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

  const projects = posts && posts.length > 0
    ? posts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      image: post.feature_image || '/placeholder.jpg',
      category: post.category,
      publishedAt: post.published_at,
      excerpt: post.excerpt,
    }))
    : allProjects.map((project) => ({
      id: project.id,
      slug: String(project.id),
      title: project.title,
      image: project.image,
      category: project.category,
      publishedAt: project.year,
      excerpt: project.location,
    }));

  return (
    <Container className="py-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">მთავარი</Breadcrumb.Item>
        <Breadcrumb.Item active>{heroTitle}</Breadcrumb.Item>
      </Breadcrumb>

      {heroImage ? (
        <div
          className="position-relative overflow-hidden rounded-4 mb-5"
          style={{ minHeight: '260px', backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.42), rgba(0,0,0,0.18))' }} />
          <div className="position-relative text-white d-flex flex-column justify-content-end h-100 p-4 p-md-5">
            <h1 className="fw-bold display-5 mb-2">{heroTitle}</h1>
            {heroDescription ? <p className="mb-0 opacity-75" style={{ maxWidth: '720px' }}>{heroDescription}</p> : null}
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <h1 className="fw-bold mb-2">{heroTitle}</h1>
            {heroDescription ? <p className="text-muted mb-0">{heroDescription}</p> : null}
          </div>
          <div className="d-none d-md-flex gap-2">
            <Button variant="outline-primary" size="sm">ყველა</Button>
            <Button variant="outline-secondary" size="sm">საცხოვრებელი</Button>
            <Button variant="outline-secondary" size="sm">კომერციული</Button>
          </div>
        </div>
      )}

      <Row className="gy-4">
        {projects.map((project, index) => (
          <Col key={project.id} md={6}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
              <Card className="border-0 shadow-sm overflow-hidden">
                <div className="position-relative overflow-hidden">
                  <Link href={`/project/${slugify(project.slug)}`}>
                    <Card.Img variant="top" src={project.image} style={{ height: '400px', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                  </Link>
                  <div className="position-absolute top-0 start-0 m-3">
                    <Badge bg="primary" className="px-3 py-2">{project.category}</Badge>
                  </div>
                </div>
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Link href={`/project/${slugify(project.slug)}`} className="fw-bold fs-4 mb-0 text-dark text-decoration-none hover-primary">
                      {project.title}
                    </Link>
                    <span className="text-primary fw-bold">{project.publishedAt}</span>
                  </div>
                  <p className="text-muted mb-0">{project.excerpt}</p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
