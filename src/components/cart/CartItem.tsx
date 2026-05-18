import { Link } from 'react-router-dom';
import type { CartItem as CartItemType } from '../../types';
import { formatPrice, getDiscountedPrice } from '../../utils/cart';
import { MIN_QUANTITY, MAX_QUANTITY } from '../../utils/constants';
import { getImageUrl } from '../../utils/api';
import styles from './CartItem.module.css';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const { product, quantity } = item;
  const discountedPrice = getDiscountedPrice(product.price, product.discount);
  const itemTotal = discountedPrice * quantity;

  return (
    <div className={styles.item}>
      <Link to={`/products/${product.id}`} className={styles.imageLink}>
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className={styles.image}
          onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
        />
      </Link>

      <div className={styles.info}>
        <Link to={`/products/${product.id}`} className={styles.name}>
          {product.name}
        </Link>
        <div className={styles.price}>
          {!!product.discount && product.discount > 0 && (
            <span className={styles.originalPrice}>
              {formatPrice(product.price)}원
            </span>
          )}
          <span>{formatPrice(discountedPrice)}원</span>
        </div>
      </div>

      <div className={styles.quantityControls}>
        <button
          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
          disabled={quantity <= MIN_QUANTITY}
          className={styles.quantityButton}
        >
          -
        </button>
        <span className={styles.quantityValue}>{quantity}</span>
        <button
          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
          disabled={quantity >= MAX_QUANTITY}
          className={styles.quantityButton}
        >
          +
        </button>
      </div>

      <div className={styles.total}>
        <span className={styles.totalLabel}>합계</span>
        <span className={styles.totalPrice}>{formatPrice(itemTotal)}원</span>
      </div>

      <button
        onClick={() => onRemove(product.id)}
        className={styles.removeButton}
        aria-label="삭제"
      >
        ✕
      </button>
    </div>
  );
}
