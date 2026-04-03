'use client';

import React from 'react';
import { Container, Row, Col, Card, Breadcrumb } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Calendar, ArrowRight } from 'lucide-react';
import { PageResponse, PostRelation } from '@/lib/api/types';
import { toBackendAssetUrl } from '@/lib/api/assets';
import { slugify } from '@/lib/slugify';
import { getAllBlogs } from '@/lib/data';

function resolvePostDisplay(p: PostRelation) {
  const intro = p.blocks?.find((b) => b.type === 'post_intro');
  return {
    title: intro?.data?.title || p.title,
    excerpt: intro?.data?.post_text || p.excerpt,
    image: toBackendAssetUrl(intro?.data?.post_image || p.feature_image || '') || '/placeholder-blog.jpg',
  };
}

export default function BlogListPage({ data }: { data?: PageResponse | null }) {
  const pageTitle = data?.page?.title || 'ბლოგი / სიახლეები';
  const posts = data?.relations?.posts;

  const blogs = posts && posts.length > 0
    ? posts.map((p) => ({ ...p, ...resolvePostDisplay(p) }))
    : getAllBlogs().map((b: any) => ({ ...b, date: b.date }));

  return (
    <div>
      <section className="py-5 bg-light">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} href="/">მთავარი</Breadcrumb.Item>
            <Breadcrumb.Item active>{pageTitle}</Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="display-5 fw-bold mt-2">{pageTitle}</h1>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <Row className="gy-4">
            {blogs.map((post: any, index: number) => {
              const href = `/blog/${slugify(post.slug)}`;
              return (
                <Col key={post.id} md={6} lg={4}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.07 }}
                    className="h-100"
                  >
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100 blog-card">
                      <Link href={href} className="text-decoration-none">
                        <div className="overflow-hidden" style={{ height: '220px' }}>
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-100 h-100"
                            style={{ objectFit: 'cover', transition: 'transform 0.5s' }}
                          />
                        </div>
                      </Link>
                      <Card.Body className="p-4 d-flex flex-column">
                        {post.category && (
                          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 mb-3 align-self-start small">{post.category}</span>
                        )}
                        <Card.Title className="fw-bold h5 mb-2">
                          <Link href={href} className="text-dark text-decoration-none">{post.title}</Link>
                        </Card.Title>
                        {post.excerpt && (
                          <Card.Text className="text-muted small mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {post.excerpt}
                          </Card.Text>
                        )}
                        <div className="mt-auto d-flex justify-content-between align-items-center">
                          <span className="text-muted small d-flex align-items-center gap-1">
                            <Calendar size={13} /> {post.published_at || post.date}
                          </span>
                          <Link href={href} className="fw-bold text-primary text-decoration-none small d-flex align-items-center gap-1">
                            სრულად <ArrowRight size={13} />
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `.blog-card:hover img { transform: scale(1.05); }` }} />
    </div>
  );
}
