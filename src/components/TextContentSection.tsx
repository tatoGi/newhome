'use client';

import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'motion/react';
import { Block } from '@/lib/api/types';

interface TextContentSectionProps {
  blocks: Block[];
}

const pickDefined = (...values: unknown[]): string => {
  const value = values.find((item) => item !== null && item !== undefined && String(item).trim() !== '');

  return String(value ?? '');
};

export default function TextContentSection({ blocks }: TextContentSectionProps) {
  const block = blocks.find((b) => b.type === 'page_text_content');

  if (!block) return null;

  const title = pickDefined(block.data?.title, block.data?.section_title);
  const subtitle = pickDefined(block.data?.subtitle, block.data?.section_subtitle);
  const content = pickDefined(block.data?.content, block.data?.textarea, block.data?.body);
  const note = pickDefined(block.data?.note);

  if (!title && !subtitle && !content && !note) return null;

  return (
    <section className="py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={9}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {title ? <h2 className="fw-bold mb-3">{title}</h2> : null}
              {subtitle ? <p className="lead text-muted mb-4">{subtitle}</p> : null}
              {content ? (
                <div className="fs-5 text-body text-start" dangerouslySetInnerHTML={{ __html: content }} />
              ) : null}
              {note ? <p className="text-muted fst-italic mt-4 mb-0">{note}</p> : null}
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
