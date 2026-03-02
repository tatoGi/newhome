import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Breadcrumb } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal } from 'lucide-react';

const allProducts = [
  { id: 1, name: "თანამედროვე სკამი 'Nordic'", price: 250, image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80", category: "ავეჯი" },
  { id: 2, name: "მინიმალისტური სანათი", price: 120, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80", category: "განათება" },
  { id: 3, name: "ხავერდის სავარძელი", price: 450, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80", category: "ავეჯი" },
  { id: 4, name: "ინდუსტრიული ჭაღი", price: 380, image: "https://images.unsplash.com/photo-1543198126-a8ad8e47fb21?auto=format&fit=crop&w=800&q=80", category: "განათება" },
  { id: 5, name: "ხის მაგიდა 'Oak'", price: 850, image: "https://images.unsplash.com/photo-1530018607912-eff2df114fbe?auto=format&fit=crop&w=800&q=80", category: "ავეჯი" },
  { id: 6, name: "კედლის სანათი", price: 95, image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80", category: "განათება" },
];

const Products: React.FC = () => {
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Newest');

  const filteredProducts = allProducts.filter(p => category === 'All' || p.category === category);

  return (
    <Container className="py-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">მთავარი</Breadcrumb.Item>
        <Breadcrumb.Item active>პროდუქცია</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
        <h1 className="fw-bold mb-0">პროდუქცია</h1>
        <div className="d-flex gap-3 align-items-center">
          <span className="text-muted d-none d-md-block">{filteredProducts.length} პროდუქტი</span>
          <Form.Select style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="Newest">უახლესი</option>
            <option value="PriceLow">ფასი: ზრდადი</option>
            <option value="PriceHigh">ფასი: კლებადი</option>
          </Form.Select>
        </div>
      </div>

      <Row>
        <Col lg={3} className="d-none d-lg-block">
          <div className="sticky-top" style={{ top: '100px' }}>
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <SlidersHorizontal size={20} /> ფილტრები
            </h5>
            <div className="mb-4">
              <h6 className="fw-bold mb-3">კატეგორია</h6>
              <Form.Check
                type="radio"
                label="ყველა"
                name="category"
                id="cat-all"
                checked={category === 'All'}
                onChange={() => setCategory('All')}
                className="mb-2"
              />
              <Form.Check
                type="radio"
                label="განათება"
                name="category"
                id="cat-lighting"
                checked={category === 'განათება'}
                onChange={() => setCategory('განათება')}
                className="mb-2"
              />
              <Form.Check
                type="radio"
                label="ავეჯი"
                name="category"
                id="cat-furniture"
                checked={category === 'ავეჯი'}
                onChange={() => setCategory('ავეჯი')}
                className="mb-2"
              />
            </div>
            <div className="mb-4">
              <h6 className="fw-bold mb-3">ფასის დიაპაზონი</h6>
              <Form.Range />
              <div className="d-flex justify-content-between text-muted small">
                <span>0 ₾</span>
                <span>2000 ₾</span>
              </div>
            </div>
          </div>
        </Col>
        <Col lg={9}>
          <Row className="gy-4">
            {filteredProducts.map(product => (
              <Col key={product.id} sm={6} md={4}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Products;
