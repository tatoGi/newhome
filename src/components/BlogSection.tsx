'use client';

import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'motion/react';
import { getAllBlogs } from '@/lib/data';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BlogSection: React.FC = () => {
    const blogs = getAllBlogs();

    return (
        <section className="py-5 bg-light">
            <Container>
                <div className="d-flex justify-content-between align-items-end mb-5">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="fw-bold display-6 mb-2">სიახლეები და ბლოგი</h2>
                        <p className="text-muted mb-0">მიიღეთ რჩევები ინტერიერის გასაუმჯობესებლად</p>
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

                <Row className="gy-4">
                    {blogs.map((blog, index) => (
                        <Col key={blog.id} lg={4}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100 blog-card">
                                    <div className="position-relative overflow-hidden" style={{ height: '240px' }}>
                                        <Card.Img
                                            variant="top"
                                            src={blog.image}
                                            className="h-100 w-100 object-fit-cover transition-transform"
                                        />
                                        <div className="position-absolute top-0 start-0 m-3">
                                            <span className="badge bg-white text-primary rounded-pill px-3 py-2 shadow-sm">ბლოგი</span>
                                        </div>
                                    </div>
                                    <Card.Body className="p-4">
                                        <div className="d-flex gap-3 mb-3 text-muted small">
                                            <span className="d-flex align-items-center gap-1">
                                                <Calendar size={14} /> {blog.date}
                                            </span>
                                            <span className="d-flex align-items-center gap-1">
                                                <User size={14} /> {blog.author}
                                            </span>
                                        </div>
                                        <Card.Title className="fw-bold h5 mb-3 line-clamp-2">
                                            <Link href={`/blog/${blog.slug}`} className="text-dark text-decoration-none">
                                                {blog.title}
                                            </Link>
                                        </Card.Title>
                                        <Card.Text className="text-muted small line-clamp-3 mb-4">
                                            {blog.excerpt}
                                        </Card.Text>
                                        <Link href={`/blog/${blog.slug}`} className="fw-bold text-primary text-decoration-none small d-inline-flex align-items-center gap-1">
                                            სრულად ნახვა <ArrowRight size={14} />
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </Container>
            <style jsx>{`
        .blog-card:hover .card-img-top {
          transform: scale(1.1);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </section>
    );
};

export default BlogSection;
