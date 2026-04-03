'use client';


import { Container, Row, Col, Card, Breadcrumb } from 'react-bootstrap';
import Link from 'next/link';
import { History, Users, Target, Award } from 'lucide-react';
import { PageResponse } from '@/lib/api/types';
import { toBackendAssetUrl } from '@/lib/api/assets';

const STAT_ICONS = [
  <History size={40} className="text-primary mb-3 mx-auto d-block" />,
  <Users size={40} className="text-primary mb-3 mx-auto d-block" />,
  <Target size={40} className="text-primary mb-3 mx-auto d-block" />,
  <Award size={40} className="text-primary mb-3 mx-auto d-block" />,
];

export default function AboutPage({ data }: { data?: PageResponse | null }) {
  const blocks = data?.page?.blocks ?? [];

  const imageTextBlock = blocks.find((b) => b.type === 'image_text');
  const statBlocks = blocks.filter((b) => b.type === 'items_grid');

  const title = imageTextBlock?.data?.title || data?.page?.title || 'ჩვენ შესახებ';
  const description = imageTextBlock?.data?.textarea || data?.page?.description || '';
  const image = imageTextBlock?.data?.image
    ? toBackendAssetUrl(String(imageTextBlock.data.image))
    : 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80';

  return (
    <div>
      <section className="py-5 bg-light">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} href="/">მთავარი</Breadcrumb.Item>
            <Breadcrumb.Item active>{data?.page?.title || 'ჩვენს შესახებ'}</Breadcrumb.Item>
          </Breadcrumb>
          <Row className="align-items-center gy-5 mt-1">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">{title}</h1>
              <div className="lead text-muted mb-4" dangerouslySetInnerHTML={{ __html: description }} />
            </Col>
            <Col lg={6}>
              <img
                src={image}
                alt={title}
                className="img-fluid rounded-4 shadow-lg"
                referrerPolicy="no-referrer"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {statBlocks.length > 0 && (
        <section className="py-5">
          <Container>
            <Row className="gy-4">
              {statBlocks.map((block, i) => (
                <Col md={3} key={i}>
                  <Card className="border-0 text-center p-4 shadow-sm h-100">
                    {STAT_ICONS[i % STAT_ICONS.length]}
                    <h3 className="fw-bold">{block.data.title}</h3>
                    <p className="text-muted mb-0">{block.data.subtitle}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}
    </div>
  );
}
