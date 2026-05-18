// 카테고리 타입
export type Category = 'electronics' | 'clothing' | 'food' | 'etc';

// 상품
export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category: Category;
  stock: number;
  discount?: number;
  badge?: string;
  createdAt: string;
}

// 상품 목록용 간략 정보
export type ProductSummary = Pick<Product, 'id' | 'name' | 'price' | 'image'>;

// 장바구니 아이템
export interface CartItem {
  product: Product;
  quantity: number;
}

// 사용자
export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  address?: string;
}

// 주문 상태
export type OrderStatus = 'pending' | 'paid' | 'shipping' | 'delivered' | 'cancelled';

// 주문 아이템
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
}

// 배송 정보
export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  detail?: string;
  memo?: string;
}

// 주문
export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingDetail?: string;
  shippingMemo?: string;
  createdAt: string;
}

// 주문 생성 요청
export interface CreateOrderRequest {
  items: { productId: number; quantity: number }[];
  shipping: ShippingAddress;
}

// 찜 아이템
export interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  product?: Product;
  createdAt: string;
}

// 인증 관련
export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// 페이지네이션 응답
export interface PaginatedResponse<T> {
  success: boolean;
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
