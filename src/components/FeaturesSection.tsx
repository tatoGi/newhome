'use client';

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { ShieldCheck, Truck, Clock } from 'lucide-react';
import { Block } from '@/lib/api/types';

const ICONS = [
  <Truck size={40} className="text-primary mb-3" />,
  <ShieldCheck size={40} className="text-primary mb-3" />,
  <Clock size={40} className="text-primary mb-3" />,
];

interface FeaturesSectionProps {
  blocks: Block[];
}

export default function FeaturesSection({ blocks }: FeaturesSectionProps) {
  const gridBlocks = blocks.filter((b) => b.type === 'items_grid');

  const repeaterItems: Array<{ title: string; desc: string }> = gridBlocks.flatMap((b) => {
    const raw = b.data.items;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item: any) => ({
        title: String(item?.title ?? ''),
        desc: String(item?.description ?? item?.subtitle ?? ''),
      }));
    }
    const title = String(b.data.section_title ?? b.data.title ?? '');
    const desc = String(b.data.section_subtitle ?? b.data.subtitle ?? '');
    if (title) return [{ title, desc }];
    return [];
  });

  if (repeaterItems.length === 0) return null;

  const items = repeaterItems.map((item, i) => ({ icon: ICONS[i % ICONS.length], ...item }));

  return (
    <section className="py-5 bg-light">
      <Container>
        <Row className="text-center gy-4">
          {items.map((item, i) => (
            <Col md={4} key={i}>
              <div className="p-4 bg-white rounded shadow-sm h-100">
                {item.icon}
                <h3 className="h5">{item.title}</h3>
                <p className="text-muted small mb-0">{item.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
