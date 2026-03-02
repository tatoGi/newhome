import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Heart, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="product-card h-100 overflow-hidden">
        <div className="position-relative">
          <Card.Img
            variant="top"
            src={product.image}
            style={{ height: '280px', objectFit: 'cover' }}
            referrerPolicy="no-referrer"
          />
          <Button
            variant="white"
            className="position-absolute top-0 end-0 m-2 shadow-sm rounded-circle p-2"
            onClick={handleWishlist}
          >
            <Heart size={18} fill={isInWishlist(product.id) ? "red" : "none"} color={isInWishlist(product.id) ? "red" : "currentColor"} />
          </Button>
        </div>
        <Card.Body className="d-flex flex-column">
          <Card.Subtitle className="text-muted small mb-2">{product.category}</Card.Subtitle>
          <Card.Title className="fs-6 mb-2">{product.name}</Card.Title>
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <span className="fw-bold fs-5">{product.price} ₾</span>
            <Button variant="outline-primary" size="sm" className="rounded-circle p-2" onClick={() => addToCart(product)}>
              <ShoppingCart size={18} />
            </Button>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
