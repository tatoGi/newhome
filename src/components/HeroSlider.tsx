'use client';

import React from 'react';
import { Carousel, Button, Container } from 'react-bootstrap';
import { motion } from 'motion/react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    title: 'თანამედროვე განათება',
    desc: 'აღმოაჩინეთ უნიკალური დიზაინის სანათები თქვენი ინტერიერისთვის',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1920&q=80',
    link: '/products/lighting',
  },
  {
    id: 2,
    title: 'პრემიუმ ხარისხის ავეჯი',
    desc: 'კომფორტი და სტილი ერთ სივრცეში. შეარჩიეთ საუკეთესო',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1920&q=80',
    link: '/products/furniture',
  },
  {
    id: 3,
    title: 'ახალი კოლექცია 2026',
    desc: 'იყავით პირველი ვინც შეიძენს სეზონის ყველაზე ტრენდულ ნივთებს',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1920&q=80',
    link: '/products',
  },
  {
    id: 4,
    title: 'ინტერიერის დიზაინი',
    desc: '3D ვიზუალიზაციიდან გასაღების ჩაბარებამდე — ჩვენ ყველაფერს ვაკეთებთ',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80',
    link: '/services',
  },
  {
    id: 5,
    title: 'სასადილო ოთახი — სიმფონია',
    desc: 'ელეგანტური სასადილო კომპლექტები ოჯახური სადილებისთვის',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1920&q=80',
    link: '/products/furniture',
  },
];

const HeroSlider: React.FC = () => {
  return (
    <Carousel fade className="hero-slider" indicators={true} interval={5000}>
      {slides.map(slide => (
        <Carousel.Item key={slide.id}>
          <img
            className="d-block w-100"
            src={slide.image}
            alt={slide.title}
            referrerPolicy="no-referrer"
            {...(slide.id === 1 ? { fetchPriority: 'high' } : { loading: 'lazy' })}
          />
          <Carousel.Caption>
            <Container>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="d-flex flex-column align-items-center text-center mx-auto"
                style={{ maxWidth: '800px' }}
              >
                <h2 className="display-6 fw-bold mb-3">{slide.title}</h2>
                <p className="fs-5 mb-4 opacity-75">{slide.desc}</p>
                <Button as={Link as any} href={slide.link} variant="primary" className="px-5 py-2 rounded-pill">
                  აღმოაჩინე მეტი
                </Button>
              </motion.div>
            </Container>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default HeroSlider;
