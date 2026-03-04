'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Form, Accordion, Breadcrumb } from 'react-bootstrap';
import ProductCard from '@/components/ProductCard';
import { allProducts } from '@/lib/data';

const categories = [
  { name: 'საძინებელი', count: 416 },
  { name: 'განათება', count: 541 },
  { name: 'სასადილო ოთახი', count: 303 },
  { name: 'შესასვლელი', count: 41 },
  { name: 'სამუშაო ოთახი', count: 98 },
  { name: 'მისაღები ოთახი', count: 1981 },
];

const materials = [
  { name: 'ხე', count: 42 },
  { name: 'ლითონი', count: 18 },
  { name: 'ტყავი', count: 8 },
  { name: 'ქსოვილი', count: 56 },
];

const filterColors = [
  { name: 'შავი', hex: '#000000' },
  { name: 'თეთრი', hex: '#ffffff' },
  { name: 'ყავისფერი', hex: '#8B5A2B' },
  { name: 'ნაცრისფერი', hex: '#708090' },
  { name: 'მწვანე', hex: '#556B2F' },
];

export default function ProductsPage({ initialCategory }: { initialCategory?: string }) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const [sort, setSort] = useState('Newest');

  const toggleItem = <T,>(arr: T[], item: T) =>
    arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

  const filteredProducts = allProducts
    .filter(p => {
      if (initialCategory) {
        const map: Record<string, string> = { lighting: 'განათება', furniture: 'ავეჯი' };
        if (map[initialCategory] && p.category !== map[initialCategory]) return false;
      }
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
      if (selectedMaterials.length > 0 && (!p.material || !selectedMaterials.includes(p.material))) return false;
      if (showSaleOnly && !p.sale) return false;
      if (selectedColors.length > 0) {
        if (!p.colors) return false;
        if (!selectedColors.some(c => p.colors?.includes(c))) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sort === 'PriceLow') return a.price - b.price;
      if (sort === 'PriceHigh') return b.price - a.price;
      return b.id - a.id;
    });

  return (
    <Container fluid className="px-lg-4 px-xl-5 py-4">
      <Breadcrumb className="mb-4 d-none d-md-flex small">
        <Breadcrumb.Item href="/">მთავარი</Breadcrumb.Item>
        <Breadcrumb.Item active>პროდუქცია</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 border-bottom pb-4">
        <h1 className="fw-bold mb-0 fs-3">ყველა პროდუქტი</h1>
        <Form.Select className="border-0 bg-transparent fw-bold text-dark" style={{ width: 'auto', boxShadow: 'none', cursor: 'pointer', fontSize: '1rem' }} value={sort} onChange={e => setSort(e.target.value)}>
          <option value="Newest">დახარისხება: უახლესი</option>
          <option value="PriceLow">ფასი: ზრდადი</option>
          <option value="PriceHigh">ფასი: კლებადი</option>
        </Form.Select>
      </div>

      <Row>
        {/* Sidebar */}
        <Col lg={3} className="d-none d-lg-block article-sidebar pe-lg-4 mt-2">
          <div className="sticky-top" style={{ top: '100px', paddingBottom: '2rem' }}>
            <Accordion defaultActiveKey={['0', '1', '2', '3', '4']} alwaysOpen>
              <Accordion.Item eventKey="0" className="bg-transparent">
                <Accordion.Header>შეთავაზებები</Accordion.Header>
                <Accordion.Body className="pt-0 pb-4 px-0">
                  <Form.Check type="switch" id="sale-switch" label="ფასდაკლებული" checked={showSaleOnly} onChange={e => setShowSaleOnly(e.target.checked)} className="mb-3 fw-bold" />
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1" className="bg-transparent">
                <Accordion.Header>ფასი</Accordion.Header>
                <Accordion.Body className="pt-0 pb-4 px-0">
                  <Form.Range className="mb-4 custom-range" />
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <div className="position-relative flex-grow-1">
                      <span className="position-absolute" style={{ left: '12px', top: '8px', color: '#555', fontSize: '0.9rem' }}>₾</span>
                      <input type="text" className="article-price-input ps-4 w-100" defaultValue="0" />
                    </div>
                    <span className="text-muted fw-bold mx-1">-</span>
                    <div className="position-relative flex-grow-1">
                      <span className="position-absolute" style={{ left: '12px', top: '8px', color: '#555', fontSize: '0.9rem' }}>₾</span>
                      <input type="text" className="article-price-input ps-4 w-100" defaultValue="8000" />
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2" className="bg-transparent">
                <Accordion.Header>ოთახი</Accordion.Header>
                <Accordion.Body className="pt-0 pb-4 px-0">
                  {categories.map((cat, idx) => (
                    <Form.Check key={idx} type="checkbox" id={`cat-${idx}`} label={`${cat.name} (${cat.count})`}
                      className="mb-3 d-flex align-items-center" checked={selectedCategories.includes(cat.name)}
                      onChange={() => setSelectedCategories(prev => toggleItem(prev, cat.name))} />
                  ))}
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="3" className="bg-transparent">
                <Accordion.Header>მასალა</Accordion.Header>
                <Accordion.Body className="pt-0 pb-4 px-0">
                  {materials.map((mat, idx) => (
                    <Form.Check key={idx} type="checkbox" id={`mat-${idx}`} label={`${mat.name} (${mat.count})`}
                      className="mb-3 d-flex align-items-center" checked={selectedMaterials.includes(mat.name)}
                      onChange={() => setSelectedMaterials(prev => toggleItem(prev, mat.name))} />
                  ))}
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="4" className="bg-transparent border-bottom-0">
                <Accordion.Header>ფერი</Accordion.Header>
                <Accordion.Body className="pt-0 pb-4 px-0">
                  <div className="d-flex flex-wrap gap-2">
                    {filterColors.map((color, idx) => (
                      <div key={idx} className="text-center" style={{ width: '30%', minWidth: '50px' }}>
                        <button
                          className={`article-swatch rounded-circle p-0 mx-auto d-block mb-1 shadow-sm ${selectedColors.includes(color.hex) ? 'active' : ''}`}
                          style={{ width: '28px', height: '28px', backgroundColor: color.hex, border: color.hex === '#ffffff' ? '1px solid #ccc' : 'none' }}
                          onClick={e => { e.preventDefault(); setSelectedColors(prev => toggleItem(prev, color.hex)); }}
                          aria-label={`${color.name} ფერი`}
                        />
                        <span className="small text-muted" style={{ fontSize: '0.75rem' }}>{color.name}</span>
                      </div>
                    ))}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </Col>

        {/* Products Grid */}
        <Col lg={9}>
          <div className="mb-4 text-muted small">{filteredProducts.length} პროდუქტი</div>
          <Row className="gy-5 gx-4 mb-5">
            {filteredProducts.map(product => (
              <Col key={product.id} sm={6} lg={4}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
