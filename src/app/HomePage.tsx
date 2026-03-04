'use client';

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import Reels from '@/components/Reels';
import ProductCard from '@/components/ProductCard';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';
import { allProducts } from '@/lib/data';

const featuredProducts = allProducts.slice(0, 4);

export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      <Reels />

      {/* Features */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center gy-4">
            {[
              { icon: <Truck size={40} className="text-primary mb-3" />, title: 'სწრაფი მიწოდება', desc: 'მიიღეთ თქვენი შეკვეთა უმოკლეს დროში მთელი საქართველოს მასშტაბით.' },
              { icon: <ShieldCheck size={40} className="text-primary mb-3" />, title: 'ხარისხის გარანტია', desc: 'ჩვენ გთავაზობთ მხოლოდ უმაღლესი ხარისხის სერტიფიცირებულ პროდუქციას.' },
              { icon: <Clock size={40} className="text-primary mb-3" />, title: '24/7 მხარდაჭერა', desc: 'ჩვენი გუნდი მზად არის დაგეხმაროთ ნებისმიერ დროს.' },
            ].map((item, i) => (
              <Col md={4} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-4 bg-white rounded shadow-sm h-100"
                >
                  {item.icon}
                  <h5>{item.title}</h5>
                  <p className="text-muted small mb-0">{item.desc}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Products */}
      <section className="py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="d-flex justify-content-between align-items-end mb-4"
          >
            <div>
              <h2 className="fw-bold mb-2">რჩეული პროდუქცია</h2>
              <p className="text-muted mb-0">აღმოაჩინეთ ჩვენი ყველაზე პოპულარული მოდელები</p>
            </div>
            <Button as={Link as any} href="/products" variant="link" className="text-primary text-decoration-none d-flex align-items-center gap-2">
              ყველას ნახვა <ArrowRight size={18} />
            </Button>
          </motion.div>
          <Row className="gy-4">
            {featuredProducts.map((product, index) => (
              <Col key={product.id} sm={6} lg={3}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="h-100"
                >
                  <ProductCard product={product} />
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* About Preview */}
      <section className="py-5 bg-light overflow-hidden">
        <Container>
          <Row className="align-items-center gy-5">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="display-5 fw-bold mb-4">NewHome - თქვენი სახლის დიზაინის პარტნიორი</h2>
                <p className="lead text-muted mb-4">
                  ჩვენი მისიაა შევქმნათ გარემო, რომელიც ასახავს თქვენს ინდივიდუალურობას. 10 წლიანი გამოცდილება ინტერიერის დიზაინსა და ავეჯის წარმოებაში.
                </p>
                <div className="d-flex gap-3">
                  <Button as={Link as any} href="/about" variant="primary" size="lg" className="px-4">ჩვენს შესახებ</Button>
                  <Button as={Link as any} href="/projects" variant="outline-primary" size="lg" className="px-4">პროექტები</Button>
                </div>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80"
                  alt="Interior Design"
                  className="img-fluid rounded shadow-lg"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-5 mb-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-primary text-white p-5 rounded-4 text-center position-relative overflow-hidden shadow-lg"
          >
            <div className="position-relative z-1">
              <h2 className="display-6 fw-bold mb-3">გსურთ ინდივიდუალური შეკვეთა?</h2>
              <p className="mb-4 opacity-75 lead">დაგვიკავშირდით და ჩვენი დიზაინერები დაგეხმარებიან იდეალური სივრცის შექმნაში</p>
              <Button as={Link as any} href="/contact" variant="light" size="lg" className="px-5 text-primary fw-bold text-uppercase">კონსულტაცია</Button>
            </div>
            <div className="position-absolute top-50 start-50 translate-middle bg-white opacity-10 rounded-circle" style={{ width: '800px', height: '800px', zIndex: 0, filter: 'blur(50px)' }} />
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
