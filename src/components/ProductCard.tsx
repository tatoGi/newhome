'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  colors?: string[];
  material?: string;
  sale?: boolean;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const [activeColor, setActiveColor] = useState(0);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div
      className="article-product-card d-flex flex-column h-100 position-relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="position-relative mb-2 overflow-hidden article-img-container" style={{ backgroundColor: '#f5f5f5', height: '360px' }}>
        <Link href={`/product/${product.id}`} className="d-block w-100 h-100 position-relative z-1">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 25vw"
            className="article-product-img"
            style={{ objectFit: 'cover' }}
          />
        </Link>

        {product.sale && (
          <span className="position-absolute top-0 start-0 m-2 badge bg-danger text-white rounded-0 px-2 py-1 fs-6 z-2">
            SALE
          </span>
        )}

        <button
          className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle border-0 d-flex align-items-center justify-content-center article-wishlist-btn"
          onClick={handleWishlist}
          aria-label={isInWishlist(product.id) ? 'სურვილებიდან წაშლა' : 'სურვილებში დამატება'}
          style={{
            width: '36px',
            height: '36px',
            opacity: isHovered || isInWishlist(product.id) ? 1 : 0,
            transition: 'all 0.2s',
            zIndex: 3,
            backgroundColor: '#ffffff',
          }}
        >
          <Heart size={18} fill={isInWishlist(product.id) ? '#D9534F' : 'none'} color={isInWishlist(product.id) ? '#D9534F' : '#333'} />
        </button>
      </div>

      <div className="d-flex flex-column flex-grow-1 px-1 mt-1">
        {product.colors && product.colors.length > 0 && (
          <div className="d-flex gap-2 mb-2 align-items-center">
            {product.colors.map((color, idx) => (
              <button
                key={idx}
                className={`article-swatch rounded-circle p-0 ${activeColor === idx ? 'active' : ''}`}
                style={{ width: '24px', height: '24px', backgroundColor: color }}
                onClick={(e) => { e.preventDefault(); setActiveColor(idx); }}
                aria-label={`ფერი ${idx + 1}`}
              />
            ))}
          </div>
        )}

        <Link href={`/product/${product.id}`} className="fw-bold text-dark article-title mb-1 text-decoration-none">
          {product.name}
        </Link>

        <div className="mt-auto d-flex gap-2 align-items-center">
          <span className="fw-bold" style={{ color: '#D9534F', fontSize: '1.05rem' }}>{product.price} ₾</span>
          {product.oldPrice && (
            <span className="text-muted text-decoration-line-through small">{product.oldPrice} ₾</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
