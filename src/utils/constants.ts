// API URL
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// 배송비 관련
export const FREE_SHIPPING_THRESHOLD = 50000; // 배송비 무료 기준
export const SHIPPING_FEE = 3000; // 기본 배송비

// 수량 관련
export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 99;

// 페이지네이션
export const PRODUCTS_PER_PAGE = 12;
export const ORDERS_PER_PAGE = 10;

// 카테고리 목록
export const CATEGORIES = [
  { value: "", label: "전체" },
  { value: "electronics", label: "전자기기" },
  { value: "clothing", label: "의류" },
  { value: "food", label: "식품" },
  { value: "etc", label: "기타" },
] as const;

// 정렬 옵션
export const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
  { value: "price_asc", label: "가격 낮은순" },
  { value: "price_desc", label: "가격 높은순" },
] as const;

// 주문 상태 라벨
export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "결제 대기",
  paid: "결제 완료",
  shipping: "배송 중",
  delivered: "배송 완료",
  cancelled: "주문 취소",
};
