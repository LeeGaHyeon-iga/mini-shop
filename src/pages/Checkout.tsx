import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { orderApi, getImageUrl } from '../utils/api';
import { formatPrice, getDiscountedPrice } from '../utils/cart';
import { Button, Input } from '../components/common';
import styles from './Checkout.module.css';

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, shippingFee, total, clearCart } = useCart();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [detail, setDetail] = useState('');
  const [memo, setMemo] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = '받는 분 이름을 입력해주세요';
    }

    if (!phone.trim()) {
      newErrors.phone = '연락처를 입력해주세요';
    } else if (!/^[0-9-]+$/.test(phone)) {
      newErrors.phone = '올바른 연락처 형식이 아닙니다';
    }

    if (!address.trim()) {
      newErrors.address = '주소를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsLoading(true);
      
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const response = await orderApi.create({
        items: orderItems,
        shipping: {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          detail: detail.trim() || undefined,
          memo: memo.trim() || undefined,
        },
      });

      if (response.success) {
        setIsOrderComplete(true);
        clearCart();
        navigate('/order/complete', {
          state: { orderId: response.order.id },
          replace: true,
        });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '주문에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOrderComplete && items.length === 0) {
    navigate('/cart', { replace: true });
    return null;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>주문/결제</h1>

      <div className={styles.content}>
        <form id="checkout-form" onSubmit={handleSubmit} className={styles.form}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>배송 정보</h2>

            <div className={styles.fields}>
              <Input
                label="받는 분"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                error={errors.name}
                fullWidth
                required
              />

              <Input
                label="연락처"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-1234-5678"
                error={errors.phone}
                fullWidth
                required
              />

              <Input
                label="주소"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="주소를 입력하세요"
                error={errors.address}
                fullWidth
                required
              />

              <Input
                label="상세 주소"
                name="detail"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="상세 주소를 입력하세요"
                fullWidth
              />

              <Input
                label="배송 메모"
                name="memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="배송 시 요청사항"
                fullWidth
              />
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>주문 상품</h2>
            <div className={styles.orderItems}>
              {items.map((item) => (
                  <div key={item.product.id} className={styles.orderItem}>
                  <img
                    src={getImageUrl(item.product.image)}
                    alt={item.product.name}
                    className={styles.itemImage}
                    onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                  />
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.product.name}</span>
                    <span className={styles.itemQty}>수량: {item.quantity}</span>
                  </div>
                  <span className={styles.itemPrice}>
                    {formatPrice(getDiscountedPrice(item.product.price, item.product.discount) * item.quantity)}원
                  </span>
                </div>
              ))}
            </div>
          </section>

          <Button
            type="submit"
            fullWidth
            size="large"
            isLoading={isLoading}
            className={styles.submitButton}
          >
            {formatPrice(total)}원 결제하기
          </Button>
        </form>

        <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>결제 금액</h2>

          <div className={styles.summaryRow}>
            <span>상품 금액</span>
            <span>{formatPrice(subtotal)}원</span>
          </div>

          <div className={styles.summaryRow}>
            <span>배송비</span>
            <span>
              {shippingFee === 0 ? (
                <span className={styles.freeShipping}>무료</span>
              ) : (
                `${formatPrice(shippingFee)}원`
              )}
            </span>
          </div>

          <div className={styles.divider} />

          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>총 결제 금액</span>
            <span>{formatPrice(total)}원</span>
          </div>

          <Button
            type="submit"
            form="checkout-form"
            fullWidth
            size="large"
            isLoading={isLoading}
          >
            {formatPrice(total)}원 결제하기
          </Button>
        </aside>
      </div>
    </div>
  );
}
