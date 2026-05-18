import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import type { Order } from '../types';
import { orderApi, getImageUrl } from '../utils/api';
import { formatPrice } from '../utils/cart';
import { ORDER_STATUS_LABELS, ORDERS_PER_PAGE } from '../utils/constants';
import { Spinner, Button } from '../components/common';
import styles from './Orders.module.css';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await orderApi.getAll({
          page,
          pageSize: ORDERS_PER_PAGE,
        });
        setOrders(response.items);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : '주문 내역을 불러오는데 실패했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page]);

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
            <h2 className={styles.sectionTitle}>주문 내역</h2>

            {loading ? (
              <Spinner />
            ) : error ? (
              <div className={styles.error}>
                <p>{error}</p>
                <Button onClick={() => setPage(1)}>다시 시도</Button>
              </div>
            ) : orders.length === 0 ? (
              <div className={styles.empty}>
                <p>주문 내역이 없습니다.</p>
                <Link to="/products">
                  <Button>쇼핑하러 가기</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className={styles.orders}>
                  {orders.map((order) => (
                    <div key={order.id} className={styles.order}>
                      <div className={styles.orderHeader}>
                        <div>
                          <span className={styles.orderId}>주문번호: {order.id}</span>
                          <span className={styles.orderDate}>
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                        <span
                          className={`${styles.status} ${
                            styles[order.status] || ''
                          }`}
                        >
                          {ORDER_STATUS_LABELS[order.status] || order.status}
                        </span>
                      </div>

                      <div className={styles.orderItems}>
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.id} className={styles.orderItem}>
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.productName}
                              className={styles.itemImage}
                              onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                            />
                            <div className={styles.itemInfo}>
                              <span className={styles.itemName}>
                                {item.productName}
                              </span>
                              <span className={styles.itemMeta}>
                                {formatPrice(item.price)}원 · {item.quantity}개
                              </span>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className={styles.moreItems}>
                            외 {order.items.length - 2}개 상품
                          </p>
                        )}
                      </div>

                      <div className={styles.orderFooter}>
                        <span className={styles.totalPrice}>
                          총 {formatPrice(order.totalPrice)}원
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className={styles.pageButton}
                    >
                      이전
                    </button>
                    <span className={styles.pageInfo}>
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className={styles.pageButton}
                    >
                      다음
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
