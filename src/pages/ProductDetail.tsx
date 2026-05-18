import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { productApi, wishlistApi, getImageUrl } from '../utils/api';
import { formatPrice, getDiscountedPrice } from '../utils/cart';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button, Spinner } from '../components/common';
import { MIN_QUANTITY, MAX_QUANTITY } from '../utils/constants';
import styles from './ProductDetail.module.css';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, isInCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await productApi.getById(Number(id));
        setProduct(response.product);
      } catch (err) {
        setError(err instanceof Error ? err.message : '상품을 불러오는데 실패했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 로그인 상태일 때 현재 상품의 찜 여부 조회
  useEffect(() => {
    if (!isAuthenticated || !id) return;

    wishlistApi.getAll()
      .then((response) => {
        const wishlisted = response.items.some(
          (item) => item.productId === Number(id)
        );
        setIsWishlisted(wishlisted);
      })
      .catch(() => {});
  }, [isAuthenticated, id]);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newValue = prev + delta;
      return Math.min(Math.max(newValue, MIN_QUANTITY), MAX_QUANTITY);
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    alert('장바구니에 추가되었습니다.');
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem(product, quantity);
    navigate('/cart');
  };

  const handleWishlistToggle = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      setWishlistLoading(true);
      if (isWishlisted) {
        await wishlistApi.remove(product.id);
        setIsWishlisted(false);
      } else {
        await wishlistApi.add(product.id);
        setIsWishlisted(true);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '오류가 발생했습니다');
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return <Spinner size="large" />;
  }

  if (error || !product) {
    return (
      <div className={styles.error}>
        <p>{error || '상품을 찾을 수 없습니다'}</p>
        <Button onClick={() => navigate('/products')}>상품 목록으로</Button>
      </div>
    );
  }

  const discountedPrice = getDiscountedPrice(product.price, product.discount);
  const hasDiscount = !!product.discount && product.discount > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
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

      <div className={styles.infoSection}>
        <h1 className={styles.name}>{product.name}</h1>

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

        <p className={styles.description}>
          {product.description || '상품 설명이 없습니다.'}
        </p>

        <div className={styles.stock}>
          {isOutOfStock ? (
            <span className={styles.outOfStock}>품절</span>
          ) : (
            <span>재고: {product.stock}개</span>
          )}
        </div>

        {!isOutOfStock && (
          <div className={styles.quantitySection}>
            <span className={styles.quantityLabel}>수량</span>
            <div className={styles.quantityControls}>
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= MIN_QUANTITY}
                className={styles.quantityButton}
              >
                -
              </button>
              <span className={styles.quantityValue}>{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= MAX_QUANTITY || quantity >= product.stock}
                className={styles.quantityButton}
              >
                +
              </button>
            </div>
          </div>
        )}

        <div className={styles.totalPrice}>
          총 금액: <strong>{formatPrice(discountedPrice * quantity)}원</strong>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.wishlistButton} ${isWishlisted ? styles.wishlisted : ''}`}
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            aria-label={isWishlisted ? '찜 해제' : '찜하기'}
          >
            {isWishlisted ? '♥' : '♡'}
          </button>
          <Button
            variant="secondary"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isInCart(product.id)}
          >
            {isInCart(product.id) ? '장바구니에 있음' : '장바구니'}
          </Button>
          <Button onClick={handleBuyNow} disabled={isOutOfStock}>
            바로 구매
          </Button>
        </div>
      </div>
    </div>
  );
}
