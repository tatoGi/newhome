'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Accordion, Breadcrumb } from 'react-bootstrap';
import { Check } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Block, ProductRelation } from '@/lib/api/types';
import { api } from '@/lib/api/client';


interface ProductsPageProps {
  initialCategory?: string;
  products?: ProductRelation[];
  pageTitle?: string;
  pageDescription?: string;
  blocks?: Block[];
}

interface ProductListItem {
  id: number;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  blocks?: Block[];
  material?: string;
  sale?: boolean;
  featured?: boolean;
  colors: string[]; // Changed from optional to required
  content?: string;
}

const extractProductGalleryImages = (blocks?: Block[]): string[] => {
  if (!Array.isArray(blocks)) {
    return [];
  }

  return blocks
    .filter((block) => block.type === 'product_gallery')
    .flatMap((block) => {
      const images = block.data?.product_images;
      return Array.isArray(images) ? images.map((image) => String(image ?? '').trim()).filter(Boolean) : [];
    });
};

const buildInfoItems = (block: Block): Array<{ title: string; description: string }> => {
  const legacyItems = Array.isArray(block.data.items) ? block.data.items : [];

  if (legacyItems.length > 0) {
    return legacyItems
      .filter((item: any) => item?.title || item?.description)
      .map((item: any) => ({
        title: String(item?.title ?? ''),
        description: String(item?.description ?? ''),
      }));
  }

  return [1, 2, 3, 4]
    .map((index) => ({
      title: String(block.data[`item_${index}_title`] ?? ''),
      description: String(block.data[`item_${index}_description`] ?? ''),
    }))
    .filter((item) => item.title || item.description);
};

export default function ProductsPage({
  initialCategory,
  products: initialProducts,
  pageTitle,
  pageDescription,
  blocks,
}: ProductsPageProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const [sort, setSort] = useState('Newest');
  const [products, setProducts] = useState<ProductRelation[]>(initialProducts || []);

  const sortedBlocks = [...(blocks ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  // Fetch product details on client side
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!initialProducts || initialProducts.length === 0) return;
      try {
        const productsWithDetails = await Promise.all(
          initialProducts.map(async (product) => {
            try {
              const detailResponse = await api.getProduct(product.slug);
              return {
                ...product,
                colors: detailResponse.product.colors || [],
                is_featured: detailResponse.product.is_featured || false,
                content: detailResponse.product.content || undefined,
              };
            } catch (error) {
              console.error(`Client-side: Failed to fetch details for product ${product.slug}:`, error);
              return product;
            }
          })
        );
        setProducts(productsWithDetails);
      } catch (error) {
        console.error('Client-side: Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [initialProducts]);
  const cmsProducts: ProductListItem[] = products?.map((product) => {
    const galleryImages = extractProductGalleryImages(product.blocks);

    return {
      id: product.id,
      name: product.title,
      content: product.content || product.excerpt || undefined,
      price: Number(product.price),
      oldPrice: product.old_price ? Number(product.old_price) : undefined,
      sale: product.on_sale,
      featured: product.is_featured,
      image: product.feature_image || galleryImages[0] || '/placeholder.jpg',
      category: product.category || 'პროდუქცია',
      slug: product.slug || `product-${product.id}`, // Fallback slug if empty
      blocks: product.blocks,
      colors: product.colors && product.colors.length > 0 ? product.colors : [], // Always return array
    };
  }) ?? [];

  const sourceProducts: ProductListItem[] = cmsProducts;
  const categories = Array.from(
    sourceProducts.reduce((acc, p) => {
      const cat = p.category?.trim();
      if (cat) acc.set(cat, (acc.get(cat) ?? 0) + 1);
      return acc;
    }, new Map<string, number>())
  ).map(([name, count]) => ({ name, count }));

  const colors = Array.from(
    sourceProducts.reduce((acc, p) => {
      if (p.colors && Array.isArray(p.colors)) {
        p.colors.forEach((color) => {
          if (color?.trim()) {
            acc.set(color, (acc.get(color) ?? 0) + 1);
          }
        });
      }
      return acc;
    }, new Map<string, number>())
  ).map(([color, count]) => ({ color, count }));

  const toggleItem = <T,>(arr: T[], item: T) =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  const filteredProducts = sourceProducts
    .filter((p) => {
      if (initialCategory) {
        const map: Record<string, string> = { lighting: 'განათება', furniture: 'ავეჯი' };
        if (map[initialCategory] && p.category !== map[initialCategory]) return false;
      }
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
      if (selectedMaterials.length > 0 && (!p.material || !selectedMaterials.includes(p.material))) return false;
      if (showSaleOnly && !p.sale) return false;
      if (selectedColors.length > 0) {
        if (!p.colors) return false;
        if (!selectedColors.some((c) => p.colors?.includes(c))) return false;
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
        <Breadcrumb.Item active>{pageTitle}</Breadcrumb.Item>
      </Breadcrumb>


      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 border-bottom pb-4">
        <div>
          <h1 className="fw-bold mb-1 fs-3">{pageTitle}</h1>
          {pageDescription ? <div className="text-muted mb-0" dangerouslySetInnerHTML={{ __html: pageDescription }} /> : null}
        </div>
        <Form.Select
          className="border-0 bg-transparent fw-bold text-dark"
          style={{ width: 'auto', boxShadow: 'none', cursor: 'pointer', fontSize: '1rem' }}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="Newest">დახარისხება: უახლესი</option>
          <option value="PriceLow">ფასი: ზრდადი</option>
          <option value="PriceHigh">ფასი: კლებადი</option>
        </Form.Select>
      </div>


      <Row>
        <Col lg={3} className="d-none d-lg-block article-sidebar pe-lg-4 mt-2">
          <div className="sticky-top" style={{ top: '100px', paddingBottom: '2rem', zIndex: 10 }}>
            <Accordion defaultActiveKey={['0', '1', '2', '3']} alwaysOpen>
              <Accordion.Item eventKey="0" className="bg-transparent">
                <Accordion.Header>შეთავაზებები</Accordion.Header>
                <Accordion.Body className="pt-0 pb-4 px-0">
                  <Form.Check
                    type="switch"
                    id="sale-switch"
                    label="ფასდაკლებული"
                    checked={showSaleOnly}
                    onChange={(e) => setShowSaleOnly(e.target.checked)}
                    className="mb-3 fw-bold"
                  />
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
                <Accordion.Header>კატეგორია</Accordion.Header>
                <Accordion.Body className="pt-0 pb-4 px-0">
                  {categories.map((cat, idx) => (
                    <Form.Check
                      key={idx}
                      type="checkbox"
                      id={`cat-${idx}`}
                      label={cat.count > 1 ? `${cat.name} (${cat.count})` : cat.name}
                      className="mb-3 d-flex align-items-center"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => setSelectedCategories((prev) => toggleItem(prev, cat.name))}
                    />
                  ))}
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="3" className="bg-transparent">
                <Accordion.Header>ფერი</Accordion.Header>
                <Accordion.Body className="pt-0 pb-4 px-0">
                  <div className="d-flex flex-wrap gap-2">
                    {colors.map((item, idx) => (

                      <div key={idx} className="d-flex flex-column align-items-center">
                        <button
                          className="rounded-circle p-0 position-relative border-0 shadow-sm"
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: item.color,
                            outline: selectedColors.includes(item.color) ? `2px solid ${item.color}` : 'none',
                            outlineOffset: '2px',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                          }}
                          onClick={() => setSelectedColors((prev) => toggleItem(prev, item.color))}
                          aria-label={`ფერი ${item.color}`}
                          title={`${item.color} (${item.count})`}
                        >
                          {selectedColors.includes(item.color) && (
                            <div className="position-absolute top-50 start-50 translate-middle text-white" style={{ mixBlendMode: 'difference' }}>
                              <Check size={16} />
                            </div>
                          )}
                        </button>
                        <small className="text-muted mt-2 text-center font-monospace" style={{ fontSize: '0.75rem', width: '50px' }}>
                          {item.count}
                        </small>
                      </div>
                    ))}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </Col>

        <Col lg={9}>
          <div className="mb-4 text-muted small">{filteredProducts.length} პროდუქტი</div>
          <Row className="gy-5 gx-4 mb-5">
            {filteredProducts.map((product) => (
              <Col key={product.id} sm={6} lg={4}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
          {filteredProducts.length === 0 ? (
            <div className="rounded-4 border bg-white p-5 text-center text-muted">
              ამ გვერდზე პროდუქტი ჯერ არ არის მიბმული.
            </div>
          ) : null}
        </Col>
      </Row>
    </Container>
  );
}
