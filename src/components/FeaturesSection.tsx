'use client';

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'motion/react';
import { ShieldCheck, Truck, Clock } from 'lucide-react';
import { Block } from '@/lib/api/types';

const ICONS = [
  <Truck size={40} className="text-primary mb-3" />,
  <ShieldCheck size={40} className="text-primary mb-3" />,
  <Clock size={40} className="text-primary mb-3" />,
];

const FALLBACK = [
  { title: 'სწრაფი მიწოდება', desc: 'მიიღეთ თქვენი შეკვეთა უმოკლეს დროში მთელი საქართველოს მასშტაბით.' },
  { title: 'ხარისხის გარანტია', desc: 'ჩვენ გთავაზობთ მხოლოდ უმაღლესი ხარისხის სერტიფიცირებულ პროდუქციას.' },
  { title: '24/7 მხარდაჭერა', desc: 'ჩვენი გუნდი მზად არის დაგეხმაროთ ნებისმიერ დროს.' },
];

interface FeaturesSectionProps {
  blocks: Block[];
}

export default function FeaturesSection({ blocks }: FeaturesSectionProps) {
  const gridBlocks = blocks.filter((b) => b.type === 'items_grid');

  // page_services block has a repeater field 'items' with {title, description}
  const repeaterItems: Array<{ title: string; desc: string }> = gridBlocks.flatMap((b) => {
    const raw = b.data.items;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item: any) => ({
        title: String(item?.title ?? ''),
        desc: String(item?.description ?? item?.subtitle ?? ''),
      }));
    }
    // fallback: single block with title/subtitle directly
    const title = String(b.data.section_title ?? b.data.title ?? '');
    const desc = String(b.data.section_subtitle ?? b.data.subtitle ?? '');
    if (title) return [{ title, desc }];
    return [];
  });

  const items = repeaterItems.length > 0
    ? repeaterItems.map((item, i) => ({ icon: ICONS[i % ICONS.length], ...item }))
    : FALLBACK.map((f, i) => ({ icon: ICONS[i], ...f }));

  return (
    <section className="py-5 bg-light">
      <Container>
        <Row className="text-center gy-4">
          {items.map((item, i) => (
            <Col md={4} key={i}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-4 bg-white rounded shadow-sm h-100"
              >
                {item.icon}
                <h3 className="h5">{item.title}</h3>
                <p className="text-muted small mb-0">{item.desc}</p>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
