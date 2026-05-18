import { useState, useEffect } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import type { Order } from '../types';
import { orderApi, getImageUrl } from '../utils/api';
import { formatPrice } from '../utils/cart';
import { Button, Spinner } from '../components/common';
import styles from './OrderComplete.module.css';

interface LocationState {
  orderId?: number;
}

export default function OrderComplete() {
  const location = useLocation();
  const orderId = (location.state as LocationState)?.orderId;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    orderApi.getById(orderId)
      .then((res) => setOrder(res.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>✓</div>
        <h1 className={styles.title}>주문이 완료되었습니다</h1>
        <p className={styles.orderId}>주문번호: {orderId}</p>

        {loading ? (
          <Spinner />
        ) : order ? (
          <div className={styles.summary}>
            <div className={styles.summaryItems}>
              {order.items.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.productName}
                    className={styles.itemImage}
                    onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                  />
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.productName}</span>
                    <span className={styles.itemMeta}>
                      {formatPrice(item.price)}원 · {item.quantity}개
                    </span>
                  </div>
                  <span className={styles.itemTotal}>
                    {formatPrice(item.price * item.quantity)}원
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.summaryFooter}>
              <div className={styles.shippingInfo}>
                <span>배송지</span>
                <span>{order.shippingName} · {order.shippingAddress}</span>
              </div>
              <div className={styles.totalRow}>
                <span>결제 금액</span>
                <strong>{formatPrice(order.totalPrice)}원</strong>
              </div>
            </div>
          </div>
        ) : null}

        <p className={styles.message}>
          주문 확인 및 배송 상태는 마이페이지에서 확인하실 수 있습니다.
        </p>
        <div className={styles.actions}>
          <Link to="/mypage/orders">
            <Button variant="outline">주문 내역 보기</Button>
          </Link>
          <Link to="/products">
            <Button>쇼핑 계속하기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
