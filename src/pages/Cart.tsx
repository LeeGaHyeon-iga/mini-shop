import { Link, useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import useCartStore from "../stores/cartStore";
import { useAuth } from "../contexts/AuthContext";
import { formatPrice, getDiscountedPrice } from "../utils/cart";
import { FREE_SHIPPING_THRESHOLD } from "../utils/constants";
import CartItem from "../components/cart/CartItem";
import { Button } from "../components/common";
import styles from "./Cart.module.css";

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, updateQuantity, removeItem, clearCart } = useCartStore(
    useShallow((state) => ({
      items: state.items,
      updateQuantity: state.updateQuantity,
      removeItem: state.removeItem,
      clearCart: state.clearCart,
    })),
  );

  const subtotal = items.reduce((sum, item) => {
    const price = getDiscountedPrice(item.product.price, item.product.discount);

    return sum + price * item.quantity;
  }, 0);

  const shippingFee =
    subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 3000;

  const total = subtotal + shippingFee;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>장바구니가 비어있습니다</h2>
        <p>상품을 추가해주세요.</p>
        <Link to="/products">
          <Button>쇼핑하러 가기</Button>
        </Link>
      </div>
    );
  }

  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>장바구니</h1>
        <button onClick={clearCart} className={styles.clearButton}>
          전체 삭제
        </button>
      </div>

      {remainingForFreeShipping > 0 && (
        <div className={styles.freeShippingNotice}>
          {formatPrice(remainingForFreeShipping)}원 더 담으면 무료배송!
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.items}>
          {items.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>주문 요약</h2>

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

          <Button fullWidth size="large" onClick={handleCheckout}>
            주문하기
          </Button>

          <p className={styles.notice}>
            {FREE_SHIPPING_THRESHOLD.toLocaleString()}원 이상 구매 시 무료배송
          </p>
        </div>
      </div>
    </div>
  );
}
