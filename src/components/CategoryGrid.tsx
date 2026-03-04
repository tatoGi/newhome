'use client';

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'motion/react';
import { getHomeCategories } from '@/lib/data';

const CategoryGrid: React.FC = () => {
    const categories = getHomeCategories();

    return (
        <section className="py-5">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-5"
                >
                    <h2 className="fw-bold display-6 mb-3">შეიძინეთ კატეგორიის მიხედვით</h2>
                    <p className="text-muted">აღმოაჩინეთ საუკეთესო გადაწყვეტილებები თქვენი სახლის თითოეული კუთხისთვის</p>
                </motion.div>

                <Row className="gy-4">
                    {categories.map((cat, index) => (
                        <Col key={cat.id} md={6} lg={3}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="category-card"
                            >
                                <Link href={cat.link} className="text-decoration-none">
                                    <div className="position-relative overflow-hidden rounded-4 shadow-sm ratio ratio-1x1">
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="object-fit-cover transition-transform"
                                            style={{ transition: 'transform 0.5s ease' }}
                                        />
                                        <div className="position-absolute inset-0 bg-dark opacity-20 hover-opacity-40 transition-opacity" />
                                        <div className="position-absolute bottom-0 start-0 p-4 w-100 text-white">
                                            <h4 className="fw-bold mb-0">{cat.name}</h4>
                                            <span className="small text-uppercase tracking-wider opacity-90">ნახვა</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </Container>
            <style jsx>{`
        .category-card:hover img {
          transform: scale(1.1);
        }
        .inset-0 {
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
        }
      `}</style>
        </section>
    );
};

export default CategoryGrid;
