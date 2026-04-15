'use client';

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Calendar, ArrowRight } from 'lucide-react';
import { BlogSection as BlogSectionType } from '@/lib/api/types';
import { toBackendAssetUrl } from '@/lib/api/assets';

interface BlogSectionProps {
    blogSection?: BlogSectionType | null;
}

const BlogSection: React.FC<BlogSectionProps> = ({ blogSection }) => {
    const sectionTitle = blogSection?.title || 'სიახლეები და ბლოგი';
    const sectionSubtitle = blogSection?.subtitle || 'მიიღეთ რჩევები ინტერიერის გასაუმჯობესებლად';

    const posts = (blogSection?.posts ?? []).map((p) => {
        const intro = (p as any).blocks?.find((b: any) => b.type === 'post_intro');
        return {
            id: p.id,
            slug: p.slug,
            title: intro?.data?.title || p.title,
            excerpt: intro?.data?.post_text || p.excerpt || '',
            image: toBackendAssetUrl(intro?.data?.post_image || p.feature_image || '') || null,
            date: p.published_at || '',
            category: p.category || '',
        };
    });

    if (posts.length === 0) return null;

    return (
        <section className="py-5 bg-light">
            <Container>
                {/* Header */}
                <div className="d-flex justify-content-between align-items-end mb-5">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="fw-bold display-6 mb-2">{sectionTitle}</h2>
                        <p className="text-muted mb-0">{sectionSubtitle}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Button as={Link as any} href="/blog" variant="link" className="text-primary text-decoration-none d-flex align-items-center gap-2 px-0">
                            ყველა პოსტი <ArrowRight size={18} />
                        </Button>
                    </motion.div>
                </div>

                {/* Posts — horizontal card: image left, text right */}
                <div className="d-flex flex-column gap-4">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/blog/${post.slug}`} className="text-decoration-none">
                                <Row className="g-0 bg-white rounded-4 shadow-sm overflow-hidden blog-row-card align-items-stretch">
                                    {/* Image — left */}
                                    <Col xs={12} md={4} className="position-relative" style={{ minHeight: '220px' }}>
                                        {post.image ? (
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-100 h-100 blog-card-img"
                                                style={{ objectFit: 'cover', display: 'block' }}
                                            />
                                        ) : (
                                            <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center" style={{ minHeight: '220px' }}>
                                                <span className="text-muted small">სურათი არ არის</span>
                                            </div>
                                        )}
                                        {post.category && (
                                            <span className="position-absolute top-0 start-0 m-3 badge bg-white text-primary rounded-pill px-3 py-2 shadow-sm">
                                                {post.category}
                                            </span>
                                        )}
                                    </Col>

                                    {/* Text — right */}
                                    <Col xs={12} md={8} className="p-4 p-md-5 d-flex flex-column justify-content-center">
                                        {post.date && (
                                            <span className="text-muted small d-flex align-items-center gap-1 mb-3">
                                                <Calendar size={13} /> {post.date}
                                            </span>
                                        )}
                                        <h3 className="fw-bold h5 mb-3 text-dark">{post.title}</h3>
                                        {post.excerpt && (
                                            <p className="text-muted small mb-4" style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}>
                                                {post.excerpt.replace(/<[^>]*>/g, '')}
                                            </p>
                                        )}
                                        <span className="fw-bold text-primary small d-inline-flex align-items-center gap-1">
                                            სრულად ნახვა <ArrowRight size={14} />
                                        </span>
                                    </Col>
                                </Row>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </Container>

            <style dangerouslySetInnerHTML={{
                __html: `
                    .blog-row-card { transition: box-shadow 0.25s, transform 0.25s; }
                    .blog-row-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important; transform: translateY(-2px); }
                    .blog-card-img { transition: transform 0.4s ease; }
                    .blog-row-card:hover .blog-card-img { transform: scale(1.04); }
                `
            }} />
        </section>
    );
};

export default BlogSection;
