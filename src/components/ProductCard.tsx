'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useFallbackLogo } from '@/context/BootstrapContext';
import { resolveImageOrFallback } from '@/lib/api/assets';

export interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  colors?: string[];
  material?: string;
  sale?: boolean;
  featured?: boolean;
  content?: string;
}

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const [activeColor, setActiveColor] = useState(0);
  const fallbackLogo = useFallbackLogo();
  const productImage = resolveImageOrFallback(product.image, fallbackLogo);
  const productSlug = product.slug || `product-${product.id}`;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product as any);
    }
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  };

  return (
    <div
      className={`premium-product-card d-flex flex-column h-100 position-relative ${product.featured ? 'has-vip' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="premium-img-container mb-2">
        <Link href={`/product/${productSlug}`} className="d-block w-100 h-100 position-relative z-1">
          <Image
            src={productImage}
            alt={product.name}
            title={product.name}
            fill
            sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, (max-width: 1400px) 33vw, 25vw"
            className="premium-product-img"
            style={{ objectFit: 'cover' }}
          />
        </Link>

        {product.sale && (
          <span className="premium-badge-sale">
            SALE
          </span>
        )}

        {product.featured && (
          <span className="premium-badge-vip">
            ★ VIP
          </span>
        )}

        <button
          className="premium-wishlist-btn"
          onClick={handleWishlist}
          aria-label={isInWishlist(product.id) ? 'სურვილებიდან წაშლა' : 'სურვილებში დამატება'}
        >
          <Heart size={18} fill={isInWishlist(product.id) ? '#D9534F' : 'none'} color={isInWishlist(product.id) ? '#D9534F' : '#333'} />
        </button>

        <button
          className="premium-cart-overlay btn"
          onClick={handleAddToCart}
          aria-label="კალათაში დამატება"
        >
          <ShoppingCart size={16} />
          <span>კალათაში დამატება</span>
        </button>
      </div>

      <div className="d-flex flex-column flex-grow-1 px-1 mt-1">
        {product.colors && product.colors.length > 0 && (
          <div className="d-flex gap-2 mb-2 align-items-center">
            {product.colors.map((color, idx) => (
              <button
                key={idx}
                className={`premium-swatch ${activeColor === idx ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={(e) => { e.preventDefault(); setActiveColor(idx); }}
                aria-label={`ფერი ${idx + 1}`}
              />
            ))}
          </div>
        )}

        <Link href={`/product/${productSlug}`} className="premium-title mb-1 text-decoration-none">
          {product.name}
        </Link>

        {product.content && (
          <p
            className="text-muted mb-2"
            style={{
              fontSize: '0.82rem',
              lineHeight: '1.45',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {stripHtml(product.content)}
          </p>
        )}

        <div className="mt-auto d-flex justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-baseline gap-2">
            <span className="premium-price">{product.price} ₾</span>
            {product.oldPrice && (
              <span className="premium-old-price text-decoration-line-through">{product.oldPrice} ₾</span>
            )}
          </div>
          <button
            type="button"
            className="btn premium-cart-inline-btn"
            onClick={handleAddToCart}
            aria-label="კალათაში დამატება"
          >
            <ShoppingCart size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
