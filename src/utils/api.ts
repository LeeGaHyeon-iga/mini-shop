import { API_URL } from './constants';
import type {
  Product,
  Order,
  WishlistItem,
  AuthResponse,
  PaginatedResponse,
  CreateOrderRequest,
  LoginInput,
  SignupInput,
} from '../types';

// 이미지 URL 변환 (서버 상대경로 → 절대 URL)
// 예: "/images/earbuds.jpg" → "http://localhost:8080/images/earbuds.jpg"
export function getImageUrl(image?: string): string {
  if (!image) return '/placeholder.svg';
  if (image.startsWith('http')) return image;
  return `${API_URL}${image}`;
}

// 토큰 가져오기
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// 기본 fetch 래퍼
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '요청에 실패했습니다');
  }

  return data;
}

// ============ 인증 API ============

export const authApi = {
  login: (input: LoginInput): Promise<AuthResponse> =>
    fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  signup: (input: SignupInput): Promise<AuthResponse> =>
    fetchApi('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  logout: (): Promise<{ success: boolean; message: string }> =>
    fetchApi('/auth/logout', { method: 'POST' }),

  me: (): Promise<AuthResponse> =>
    fetchApi('/auth/me'),

  refresh: (refreshToken: string): Promise<AuthResponse> =>
    fetchApi('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
};

// ============ 상품 API ============

interface ProductsQuery {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  sort?: string;
}

export const productApi = {
  getAll: (query: ProductsQuery = {}): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    if (query.page) params.append('page', String(query.page));
    if (query.pageSize) params.append('pageSize', String(query.pageSize));
    if (query.category) params.append('category', query.category);
    if (query.search) params.append('search', query.search);
    if (query.sort) params.append('sort', query.sort);
    
    const queryString = params.toString();
    return fetchApi(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number): Promise<{ success: boolean; product: Product }> =>
    fetchApi(`/products/${id}`),

  getCategories: (): Promise<{ success: boolean; categories: string[] }> =>
    fetchApi('/products/categories'),
};

// ============ 주문 API ============

interface OrdersQuery {
  page?: number;
  pageSize?: number;
}

export const orderApi = {
  create: (data: CreateOrderRequest): Promise<{ success: boolean; message: string; order: Order }> =>
    fetchApi('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: (query: OrdersQuery = {}): Promise<PaginatedResponse<Order>> => {
    const params = new URLSearchParams();
    if (query.page) params.append('page', String(query.page));
    if (query.pageSize) params.append('pageSize', String(query.pageSize));
    
    const queryString = params.toString();
    return fetchApi(`/orders${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: number): Promise<{ success: boolean; order: Order }> =>
    fetchApi(`/orders/${id}`),
};

// ============ 사용자 API ============

interface UpdateUserInput {
  name?: string;
  phone?: string;
  address?: string;
}

export const userApi = {
  update: (data: UpdateUserInput): Promise<AuthResponse> =>
    fetchApi('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// ============ 찜 API ============

export const wishlistApi = {
  getAll: (): Promise<{ success: boolean; items: WishlistItem[] }> =>
    fetchApi('/wishlist'),

  add: (productId: number): Promise<{ success: boolean; message: string }> =>
    fetchApi('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }),

  remove: (productId: number): Promise<{ success: boolean; message: string }> =>
    fetchApi(`/wishlist/${productId}`, {
      method: 'DELETE',
    }),
};
