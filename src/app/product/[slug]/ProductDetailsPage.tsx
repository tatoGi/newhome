'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Button, Modal, Carousel, Tabs, Tab } from 'react-bootstrap';
import Link from 'next/link';
import { Heart, ShoppingCart, ChevronRight, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import ProductCard from '@/components/ProductCard';
import { Product, allProducts } from '@/lib/data';

type ProductDetails = Product & {
  coverImage?: string | null;
  brand?: string;
  content?: string;
};

export default function ProductDetailsPage({ product }: { product: ProductDetails }) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const { user, openAuthModal } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [showSlider, setShowSlider] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Filter related products by same category, excluding current product
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({ id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.images[0], category: product.category });
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      openAuthModal('register');
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart({ id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.images[0], category: product.category });
    }
  };

  return (
    <div className="bg-light">
      {product.coverImage && (
        <div
          className="position-relative overflow-hidden"
          style={{
            minHeight: '320px',
            backgroundImage: `url(${product.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.2))' }}
          />
          <Container className="position-relative text-white py-5" style={{ minHeight: '320px' }}>
            <div className="d-flex flex-column justify-content-end h-100">
              <div className="mb-4 d-flex align-items-center small opacity-75">
                <Link href="/" className="text-white text-decoration-none">მთავარი</Link>
                <ChevronRight size={14} className="mx-2" />
                <Link href="/products" className="text-white text-decoration-none">პროდუქცია</Link>
              </div>
              <h1 className="display-5 fw-bold mb-0">{product.name}</h1>
            </div>
          </Container>
        </div>
      )}

      <div className="py-5">
        <Container>
          {/* Breadcrumb */}
          {!product.coverImage && <div className="mb-4 d-flex align-items-center text-muted small">
            <Link href="/" className="text-muted text-decoration-none">მთავარი</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link href="/products" className="text-muted text-decoration-none">პროდუქცია</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-dark fw-medium">{product.name}</span>
          </div>}

          <div className="bg-white p-4 p-md-5 rounded shadow-sm mb-5">
            <Row className="gy-5">
              {/* Images */}
              <Col lg={6}>
                <div className="d-flex flex-column gap-3">
                  <div className="rounded overflow-hidden position-relative" style={{ cursor: 'pointer', height: '500px', backgroundColor: '#f8f9fa' }} onClick={() => setShowSlider(true)}>
                    <img src={product.images[activeImageIndex]} alt={product.name} className="w-100 h-100 object-fit-cover"
                      style={{ transition: 'transform 0.3s ease' }}
                      onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                      referrerPolicy="no-referrer" />
                    <div className="position-absolute bottom-0 end-0 m-3 px-3 py-1 bg-white rounded-pill shadow-sm small fw-medium">🔍 გაშლა</div>
                  </div>
                  <Row className="gx-2">
                    {product.images.map((img, idx) => (
                      <Col xs={3} key={idx}>
                        <div className={`rounded overflow-hidden border ${activeImageIndex === idx ? 'border-primary border-2' : 'border-light'} p-1`}
                          style={{ cursor: 'pointer', height: '80px' }} onClick={() => setActiveImageIndex(idx)}>
                          <img src={img} alt={`${product.name} ${idx + 1}`} className="w-100 h-100 object-fit-cover" referrerPolicy="no-referrer" />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Col>

              {/* Details */}
              <Col lg={6}>
                <div className="ps-lg-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h1 className="fw-bold fs-2">{product.name}</h1>
                    <button className="btn btn-light rounded-circle border-0 d-flex align-items-center justify-content-center mt-1"
                      onClick={handleWishlist} style={{ width: '45px', height: '45px', backgroundColor: '#f8f9fa' }}>
                      <Heart size={22} fill={isInWishlist(product.id) ? '#D9534F' : 'none'} color={isInWishlist(product.id) ? '#D9534F' : '#333'} />
                    </button>
                  </div>

                  {product.brand && <p className="text-muted mb-1 small">ბრენდი: <span className="fw-medium text-dark">{product.brand}</span></p>}

                  <p className="text-muted mb-4">კოდი: NH-{product.id}-2026</p>

                  <div className="d-flex align-items-end gap-3 mb-4">
                    <span className="fw-bold text-dark fs-3">{product.price} ₾</span>
                    {product.oldPrice && <span className="text-muted text-decoration-line-through fs-5 pb-1">{product.oldPrice} ₾</span>}
                    {product.oldPrice && <span className="badge bg-danger ms-2 mb-2 pb-1">ფასდაკლება</span>}
                  </div>

                  <hr className="my-4 text-muted opacity-25" />

                  {/* Colors */}
                  {product.colors && (
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">ფერის არჩევა:</h6>
                      <div className="d-flex gap-2">
                        {product.colors.map((color, idx) => (
                          <button key={idx} className="rounded-circle p-0 position-relative border-0 shadow-sm"
                            style={{ width: '40px', height: '40px', backgroundColor: color, outline: activeColor === idx ? `2px solid ${color}` : 'none', outlineOffset: '2px', transition: 'all 0.2s ease' }}
                            onClick={() => setActiveColor(idx)} aria-label={`ფერი ${idx + 1}`}>
                            {activeColor === idx && <div className="position-absolute top-50 start-50 translate-middle text-white mix-blend-difference"><Check size={16} /></div>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4 d-flex flex-column gap-2">
                    {product.brand && (
                      <div className="d-flex gap-2">
                        <span className="text-muted" style={{ width: '160px' }}>ბრენდი:</span>
                        <span className="fw-medium">{product.brand}</span>
                      </div>
                    )}
                    <div className="d-flex gap-2">
                      <span className="text-muted" style={{ width: '160px' }}>ხელმისაწვდომობა:</span>
                      <span className="fw-medium text-success">მარაგშია</span>
                    </div>
                  </div>

                  <hr className="my-4 text-muted opacity-25" />

                  <div className="d-flex gap-3 align-items-center mb-4">
                    <div className="d-flex align-items-center border rounded">
                      <Button variant="light" className="border-0 px-3 py-2 text-dark fs-5 bg-transparent" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                      <span className="px-3 fw-medium">{quantity}</span>
                      <Button variant="light" className="border-0 px-3 py-2 text-dark fs-5 bg-transparent" onClick={() => setQuantity(quantity + 1)}>+</Button>
                    </div>
                    <Button variant="primary" size="lg" className="flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-3 fw-bold" onClick={handleAddToCart}>
                      <ShoppingCart size={20} /> კალათაში დამატება
                    </Button>
                  </div>

                  <div className="bg-light p-3 rounded mt-4 text-muted small lh-lg">
                    ✓ უფასო მიწოდება 500 ₾-ის ზემოთ<br />
                    ✓ 2 წლიანი გარანტია<br />
                    ✓ გადაცვლა / დაბრუნება 14 დღის განმავლობაში
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* Description & Specs */}
          <div className="bg-white p-4 p-md-5 rounded shadow-sm mb-5">
            <Tabs defaultActiveKey="description" className="mb-4 border-bottom-0">
              <Tab eventKey="description" title="აღწერა">
                <div className="py-3 px-2">
                  <h4 className="fw-bold mb-4">პროდუქტის შესახებ</h4>
                  {product.content ? (
                    <div
                      className="product-content lh-lg"
                      dangerouslySetInnerHTML={{ __html: product.content }}
                    />
                  ) : (
                    <p className="text-muted lh-lg fs-5">{product.description}</p>
                  )}
                </div>
              </Tab>
              <Tab eventKey="specs" title="სპეციფიკაციები">
                <div className="py-3 px-2">
                  <h4 className="fw-bold mb-4">ტექნიკური მახასიათებლები</h4>
                  {product.specifications && (
                    <Row><Col md={8}>
                      <table className="table table-bordered table-striped m-0">
                        <tbody>
                          {Object.entries(product.specifications).map(([key, val], idx) => (
                            <tr key={idx}>
                              <th className="w-50 text-muted fw-normal">{key}</th>
                              <td className="w-50 fw-medium">{val}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Col></Row>
                  )}
                </div>
              </Tab>
            </Tabs>
          </div>

{/* Related Products */}
          <div>
            <h3 className="fw-bold mb-4 border-bottom pb-2">მსგავსი პროდუქტები</h3>
            <Row className="gy-4">
              {relatedProducts.map(p => (
                <Col sm={6} key={p.id}>
                  <ProductCard product={p} />
                </Col>
              ))}
            </Row>
          </div>
        </Container>
      </div>

      {/* Lightbox */}
      <Modal show={showSlider} onHide={() => setShowSlider(false)} size="xl" centered contentClassName="bg-transparent border-0">
        <Modal.Header closeButton className="border-0 position-absolute end-0 z-3 m-2" style={{ filter: 'invert(1)' }} />
        <Modal.Body className="p-0">
          <Carousel activeIndex={activeImageIndex} onSelect={s => setActiveImageIndex(s)} slide={false} interval={null} indicators>
            {product.images.map((img, idx) => (
              <Carousel.Item key={idx}>
                <img src={img} alt={`${product.name} ${idx + 1}`} className="d-block w-100"
                  style={{ height: '80vh', objectFit: 'contain', backgroundColor: 'rgba(0,0,0,0.8)' }} referrerPolicy="no-referrer" />
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
      </Modal>
    </div>
  );
}
