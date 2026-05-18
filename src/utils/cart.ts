import type { CartItem } from '../types';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from './constants';

// 상품 합계 계산
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const price = item.product.discount
      ? item.product.price * (100 - item.product.discount) / 100
      : item.product.price;
    return sum + price * item.quantity;
  }, 0);
}

// 배송비 계산
export function calculateShippingFee(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

// 총 결제 금액 계산
export function calculateTotal(items: CartItem[]): number {
  const subtotal = calculateSubtotal(items);
  const shippingFee = calculateShippingFee(subtotal);
  return subtotal + shippingFee;
}

// 총 수량 계산
export function calculateTotalQuantity(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

// 할인 적용 가격 계산
export function getDiscountedPrice(price: number, discount?: number): number {
  if (!discount) return price;
  return Math.floor(price * (100 - discount) / 100);
}

// 가격 포맷팅
export function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR');
}
