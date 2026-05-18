import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { formatPrice, getDiscountedPrice } from '../../utils/cart';
import { getImageUrl } from '../../utils/api';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountedPrice = getDiscountedPrice(product.price, product.discount);
  const hasDiscount = !!product.discount && product.discount > 0;

  return (
    <Link to={`/products/${product.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className={styles.image}
          onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
        />
        {product.badge && (
          <span className={styles.badge}>{product.badge}</span>
        )}
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.priceWrapper}>
          {hasDiscount && (
            <>
              <span className={styles.discount}>{product.discount}%</span>
              <span className={styles.originalPrice}>
                {formatPrice(product.price)}원
              </span>
            </>
          )}
          <span className={styles.price}>{formatPrice(discountedPrice)}원</span>
        </div>
        {product.stock === 0 && (
          <span className={styles.soldOut}>품절</span>
        )}
      </div>
    </Link>
  );
}
