'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Form, Accordion, Breadcrumb } from 'react-bootstrap';
import { Check } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Block, ProductRelation, ProductCategoryRelation } from '@/lib/api/types';
import { resolveImageOrFallback } from '@/lib/api/assets';
import { useFallbackLogo } from '@/context/BootstrapContext';
import PageBlockRenderer from '@/components/PageBlockRenderer';


interface ProductsPageProps {
  initialCategory?: string;
  products?: ProductRelation[];
  categories?: ProductCategoryRelation[];
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
  brand: string;
  materials: string[];
  sale?: boolean;
  featured?: boolean;
  stock: number;
  isOrdered: boolean;
  isRented: boolean;
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

const extractMaterialsFromBlocks = (blocks?: Block[]): string[] => {
  if (!Array.isArray(blocks)) {
    return [];
  }

  const keys = ['material', 'materials', 'main_material', 'frame_material', 'upholstery_material'];
  const values = new Set<string>();

  for (const block of blocks) {
    const data = block?.data ?? {};
    for (const key of keys) {
      const raw = data[key];
      if (typeof raw === 'string' && raw.trim() !== '') {
        values.add(raw.trim());
      }
      if (Array.isArray(raw)) {
        raw.forEach((item) => {
          const normalized = String(item ?? '').trim();
          if (normalized !== '') {
            values.add(normalized);
          }
        });
      }
    }
  }

  return Array.from(values);
};

export default function ProductsPage({
  initialCategory,
  products: initialProducts,
  categories: childCategories,
  pageTitle,
  pageDescription,
  blocks,
}: ProductsPageProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [hideOrderedAndRented, setHideOrderedAndRented] = useState(true);
  const [sort, setSort] = useState('Default');
  const fallbackLogo = useFallbackLogo();

  const products = initialProducts || [];
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
      image: product.feature_image || galleryImages[0] || '',
      category: product.category || 'პროდუქცია',
      slug: product.slug || `product-${product.id}`, // Fallback slug if empty
      blocks: product.blocks,
      brand: String(product.brand || '').trim(),
      materials: extractMaterialsFromBlocks(product.blocks),
      stock: Number(product.stock ?? 0),
      isOrdered: Boolean(product.is_ordered),
      isRented: Boolean(product.is_rented),
      colors: product.colors && product.colors.length > 0 ? product.colors : [], // Always return array
    };
  }) ?? [];

  const sourceProducts: ProductListItem[] = cmsProducts;

  const priceBounds = useMemo(() => {
    const prices = sourceProducts
      .map((p) => Number(p.price))
      .filter((price) => Number.isFinite(price) && price >= 0);

    if (prices.length === 0) {
      return { min: 0, max: 0 };
    }

    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [sourceProducts]);

  const [minPrice, setMinPrice] = useState<number>(priceBounds.min);
  const [maxPrice, setMaxPrice] = useState<number>(priceBounds.max);

  useEffect(() => {
    setMinPrice(priceBounds.min);
    setMaxPrice(priceBounds.max);
  }, [priceBounds.min, priceBounds.max]);
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

  const brands = Array.from(
    sourceProducts.reduce((acc, p) => {
      const brand = p.brand.trim();
      if (brand) {
        acc.set(brand, (acc.get(brand) ?? 0) + 1);
      }
      return acc;
    }, new Map<string, number>())
  ).map(([name, count]) => ({ name, count }));

  const materials = Array.from(
    sourceProducts.reduce((acc, p) => {
      p.materials.forEach((material) => {
        const normalized = material.trim();
        if (normalized) {
          acc.set(normalized, (acc.get(normalized) ?? 0) + 1);
        }
      });
      return acc;
    }, new Map<string, number>())
  ).map(([name, count]) => ({ name, count }));

  const toggleItem = <T,>(arr: T[], item: T) =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  const filteredProducts = sourceProducts
    .filter((p) => {
      if (initialCategory) {
        const map: Record<string, string> = { lighting: 'განათება', furniture: 'ავეჯი' };
        if (map[initialCategory] && p.category !== map[initialCategory]) return false;
      }
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
      if (selectedMaterials.length > 0 && !selectedMaterials.some((material) => p.materials.includes(material))) return false;
      if (showSaleOnly && !p.sale) return false;
      if (showFeaturedOnly && !p.featured) return false;
      if (inStockOnly && p.stock <= 0) return false;
      if (hideOrderedAndRented && (p.isOrdered || p.isRented)) return false;
      if (selectedColors.length > 0) {
        if (!p.colors) return false;
        if (!selectedColors.some((c) => p.colors?.includes(c))) return false;
      }
      if (p.price < minPrice || p.price > maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'PriceLow') return a.price - b.price;
      if (sort === 'PriceHigh') return b.price - a.price;
      if (sort === 'Newest') return b.id - a.id;
      // Default: featured (VIP) first, then newest — mirrors admin panel order
      const featuredDiff = (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (featuredDiff !== 0) return featuredDiff;
      return b.id - a.id;
    });

  return (
    <>
    <PageBlockRenderer
      blocks={(blocks ?? []).filter((b) => b.type !== 'main_banner' && b.type !== 'page_hero' && b.type !== 'banner')}
      pageTitle={pageTitle}
      pageDescription={pageDescription}
    />
    <Container fluid className="px-lg-4 px-xl-5 py-4">
      <Breadcrumb className="mb-4 d-none d-md-flex small">
        <Breadcrumb.Item href="/">მთავარი</Breadcrumb.Item>
        <Breadcrumb.Item active>{pageTitle}</Breadcrumb.Item>
      </Breadcrumb>


      {childCategories && childCategories.length > 0 ? (
        <div className="mb-5">
          <Row className="g-3 g-md-4">
            {childCategories.map((cat) => {
              const image = resolveImageOrFallback(cat.feature_image, fallbackLogo);
              return (
                <Col key={cat.id} xs={6} md={4} lg={3}>
                  <Link
                    href={`/${cat.slug}`}
                    className="d-block text-decoration-none text-dark border rounded-3 overflow-hidden bg-white h-100 shadow-sm"
                  >
                    <div className="ratio ratio-4x3 bg-light">
                      <img
                        src={image}
                        alt={cat.title}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="p-3 d-flex justify-content-between align-items-center">
                      <span className="fw-semibold">{cat.title}</span>
                      <span className="small text-muted">{cat.product_count}</span>
                    </div>
                  </Link>
                </Col>
              );
            })}
          </Row>
        </div>
      ) : null}

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
          <option value="Default">დახარისხება: სტანდარტული</option>
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
                  <Form.Check
                    type="switch"
                    id="featured-switch"
                    label="VIP (გამორჩეული)"
                    checked={showFeaturedOnly}
                    onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                    className="mb-3 fw-bold"
                  />
                  <Form.Check
                    type="switch"
                    id="stock-switch"
                    label="მხოლოდ მარაგში"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="mb-3 fw-bold"
                  />
                  <Form.Check
                    type="switch"
                    id="status-switch"
                    label="გამორთე შეკვეთილი/გაქირავებული"
                    checked={hideOrderedAndRented}
                    onChange={(e) => setHideOrderedAndRented(e.target.checked)}
                    className="mb-1 fw-bold"
                  />
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1" className="bg-transparent">
                <Accordion.Header>ფასი</Accordion.Header>
                <Accordion.Body className="pt-0 pb-4 px-0">
                  <Form.Range
                    className="mb-4 custom-range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={maxPrice}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setMaxPrice(Math.max(value, minPrice));
                    }}
                  />
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <div className="position-relative flex-grow-1">
                      <span className="position-absolute" style={{ left: '12px', top: '8px', color: '#555', fontSize: '0.9rem' }}>₾</span>
                      <input
                        type="number"
                        className="article-price-input ps-4 w-100"
                        min={priceBounds.min}
                        max={priceBounds.max}
                        value={minPrice}
                        onChange={(event) => {
                          const value = Number(event.target.value || priceBounds.min);
                          setMinPrice(Math.min(Math.max(value, priceBounds.min), maxPrice));
                        }}
                      />
                    </div>
                    <span className="text-muted fw-bold mx-1">-</span>
                    <div className="position-relative flex-grow-1">
                      <span className="position-absolute" style={{ left: '12px', top: '8px', color: '#555', fontSize: '0.9rem' }}>₾</span>
                      <input
                        type="number"
                        className="article-price-input ps-4 w-100"
                        min={priceBounds.min}
                        max={priceBounds.max}
                        value={maxPrice}
                        onChange={(event) => {
                          const value = Number(event.target.value || priceBounds.max);
                          setMaxPrice(Math.max(Math.min(value, priceBounds.max), minPrice));
                        }}
                      />
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
                <Accordion.Header>ბრენდი</Accordion.Header>
                <Accordion.Body className="pt-0 pb-4 px-0">
                  {brands.map((brand, idx) => (
                    <Form.Check
                      key={idx}
                      type="checkbox"
                      id={`brand-${idx}`}
                      label={brand.count > 1 ? `${brand.name} (${brand.count})` : brand.name}
                      className="mb-3 d-flex align-items-center"
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => setSelectedBrands((prev) => toggleItem(prev, brand.name))}
                    />
                  ))}
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="4" className="bg-transparent">
                <Accordion.Header>მასალა</Accordion.Header>
                <Accordion.Body className="pt-0 pb-4 px-0">
                  {materials.length === 0 ? (
                    <div className="text-muted small">მასალის მონაცემი არ არის შევსებული.</div>
                  ) : (
                    materials.map((material, idx) => (
                      <Form.Check
                        key={idx}
                        type="checkbox"
                        id={`material-${idx}`}
                        label={material.count > 1 ? `${material.name} (${material.count})` : material.name}
                        className="mb-3 d-flex align-items-center"
                        checked={selectedMaterials.includes(material.name)}
                        onChange={() => setSelectedMaterials((prev) => toggleItem(prev, material.name))}
                      />
                    ))
                  )}
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="5" className="bg-transparent">
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
    </>
  );
}
