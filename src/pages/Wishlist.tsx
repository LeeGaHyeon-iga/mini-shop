import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import type { WishlistItem } from '../types';
import { wishlistApi, getImageUrl } from '../utils/api';
import { formatPrice, getDiscountedPrice } from '../utils/cart';
import { useCart } from '../contexts/CartContext';
import { Spinner, Button } from '../components/common';
import styles from './Wishlist.module.css';

export default function Wishlist() {
  const { addItem } = useCart();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await wishlistApi.getAll();
      setItems(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : '찜 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: number) => {
    try {
      await wishlistApi.remove(productId);
      setItems((prev) => prev.filter((item) => item.productId !== productId));
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제에 실패했습니다');
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    if (!item.product) return;
    addItem(item.product, 1);
    alert('장바구니에 추가되었습니다.');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>마이페이지</h1>

      <div className={styles.content}>
        <nav className={styles.sidebar}>
          <NavLink
            to="/mypage"
            end
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            내 정보
          </NavLink>
          <NavLink
            to="/mypage/orders"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            주문 내역
          </NavLink>
          <NavLink
            to="/mypage/wishlist"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            찜 목록
          </NavLink>
        </nav>

        <main className={styles.main}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>찜 목록</h2>

            {loading ? (
              <Spinner />
            ) : error ? (
              <div className={styles.error}>
                <p>{error}</p>
                <Button onClick={fetchWishlist}>다시 시도</Button>
              </div>
            ) : items.length === 0 ? (
              <div className={styles.empty}>
                <p>찜한 상품이 없습니다.</p>
                <Link to="/products">
                  <Button>쇼핑하러 가기</Button>
                </Link>
              </div>
            ) : (
              <div className={styles.items}>
                {items.map((item) => {
                  if (!item.product) return null;
                  const product = item.product;
                  const discountedPrice = getDiscountedPrice(
                    product.price,
                    product.discount
                  );

                  return (
                    <div key={item.id} className={styles.item}>
                      <Link
                        to={`/products/${product.id}`}
                        className={styles.imageLink}
                      >
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className={styles.image}
                          onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                        />
                      </Link>

                      <div className={styles.info}>
                        <Link
                          to={`/products/${product.id}`}
                          className={styles.name}
                        >
                          {product.name}
                        </Link>
                        <div className={styles.priceWrapper}>
                          {!!product.discount && product.discount > 0 && (
                            <>
                              <span className={styles.discount}>
                                {product.discount}%
                              </span>
                              <span className={styles.originalPrice}>
                                {formatPrice(product.price)}원
                              </span>
                            </>
                          )}
                          <span className={styles.price}>
                            {formatPrice(discountedPrice)}원
                          </span>
                        </div>
                      </div>

                      <div className={styles.actions}>
                        <Button
                          size="small"
                          onClick={() => handleAddToCart(item)}
                          disabled={product.stock === 0}
                        >
                          {product.stock === 0 ? '품절' : '장바구니'}
                        </Button>
                        <Button
                          size="small"
                          variant="outline"
                          onClick={() => handleRemove(item.productId)}
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
