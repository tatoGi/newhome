// ============================================================
// API Client — handle fetch requests to Laravel Backend
// ============================================================

import {
    AuthResponse,
    BootstrapResponse,
    CheckoutResultResponse,
    CheckoutStartResponse,
    CheckoutSummaryResponse,
    FrontendCart,
    FrontendUser,
    PageResponse,
    PostResponse,
    ProductResponse,
    ProductRelation,
    SavedCard,
} from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/web';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...options.headers,
        },
        next: process.env.NODE_ENV === 'development'
            ? { revalidate: 0 }
            : { revalidate: 3600 },
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`API Error [${response.status}]: ${url}`, errorBody);
        throw new Error(`Failed to fetch from API: ${response.statusText}`);
    }

    return response.json();
}

export async function fetchAuthApi<T>(endpoint: string, options: RequestInit = {}, token?: string): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
        cache: 'no-store',
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`API Error [${response.status}]: ${url}`, errorBody);
        throw new Error(errorBody || `Failed request: ${response.statusText}`);
    }

    return response.json();
}

// ────────────────────────────────────────────────────────────
// Specific API methods
// ────────────────────────────────────────────────────────────

export const api = {
    /**
     * Initial bootstrap data (navigation, languages, route-map)
     */
    async getBootstrap(locale?: string): Promise<BootstrapResponse> {
        const query = locale ? `?locale=${locale}` : '';
        return fetchApi<BootstrapResponse>(`/bootstrap${query}`);

    },

    /**
     * Detail data for a single page
     */
    async getPage(slug: string, locale?: string): Promise<PageResponse> {
        const query = locale ? `?locale=${locale}` : '';
        return fetchApi<PageResponse>(`/pages/${slug}${query}`);
    },

    /**
     * Detail data for a single post/news item
     */
    async getPost(slug: string, locale?: string): Promise<PostResponse> {
        const query = locale ? `?locale=${locale}` : '';
        return fetchApi<PostResponse>(`/news/${slug}${query}`);
    },

    /**
     * Detail data for a single blog item
     */
    async getBlog(slug: string, locale?: string): Promise<PostResponse> {
        const query = locale ? `?locale=${locale}` : '';
        return fetchApi<PostResponse>(`/blog/${slug}${query}`);
    },

    /**
     * Detail data for a single project
     */
    async getProject(slug: string, locale?: string): Promise<PostResponse> {
        const query = locale ? `?locale=${locale}` : '';
        return fetchApi<PostResponse>(`/projects/${slug}${query}`);
    },

    /**
     * Detail data for a single service
     */
    async getService(slug: string, locale?: string): Promise<PostResponse> {
        const query = locale ? `?locale=${locale}` : '';
        return fetchApi<PostResponse>(`/services/${slug}${query}`);
    },

    /**
     * All published products listing
     */
    async getProducts(locale?: string): Promise<{ products: ProductRelation[] }> {
        const query = locale ? `?locale=${locale}` : '';
        return fetchApi<{ products: ProductRelation[] }>(`/products${query}`);
    },

    /**
     * Detail data for a single product
     */
    async getProduct(slug: string, locale?: string): Promise<ProductResponse> {
        const query = locale ? `?locale=${locale}` : '';
        return fetchApi<ProductResponse>(`/products/${slug}${query}`);
    },

    async register(payload: {
        name: string;
        email: string;
        phone: string;
        address: string;
        password: string;
        password_confirmation: string;
    }): Promise<AuthResponse> {
        return fetchAuthApi<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async login(payload: { email: string; password: string; }): Promise<AuthResponse> {
        return fetchAuthApi<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async me(token: string): Promise<{ user: FrontendUser }> {
        return fetchAuthApi<{ user: FrontendUser }>('/auth/me', {}, token);
    },

    async updateProfile(token: string, payload: {
        name: string;
        email: string;
        phone: string;
        address: string;
    }): Promise<{ user: FrontendUser }> {
        return fetchAuthApi<{ user: FrontendUser }>('/auth/me', {
            method: 'PUT',
            body: JSON.stringify(payload),
        }, token);
    },

    async logout(token: string): Promise<{ success: boolean }> {
        return fetchAuthApi<{ success: boolean }>('/auth/logout', {
            method: 'POST',
        }, token);
    },

    async getWishlist(authToken?: string | null): Promise<{ items: any[] }> {
        return fetchAuthApi<{ items: any[] }>('/wishlist', {}, authToken || undefined);
    },

    async addToWishlist(
        payload: { product_id: number; },
        authToken?: string | null,
    ): Promise<{ items: any[] }> {
        return fetchAuthApi<{ items: any[] }>('/wishlist', {
            method: 'POST',
            body: JSON.stringify(payload),
        }, authToken || undefined);
    },

    async removeFromWishlist(
        productId: number,
        authToken?: string | null,
    ): Promise<{ items: any[] }> {
        return fetchAuthApi<{ items: any[] }>(`/wishlist/${productId}`, {
            method: 'DELETE',
        }, authToken || undefined);
    },

    async getCart(cartToken?: string | null, authToken?: string | null): Promise<{ cart: FrontendCart }> {
        return fetchAuthApi<{ cart: FrontendCart }>('/cart', {
            headers: {
                ...(cartToken ? { 'X-Cart-Token': cartToken } : {}),
            },
        }, authToken || undefined);
    },

    async addCartItem(
        payload: { product_id: number; quantity?: number; },
        cartToken?: string | null,
        authToken?: string | null,
    ): Promise<{ cart: FrontendCart }> {
        return fetchAuthApi<{ cart: FrontendCart }>('/cart/items', {
            method: 'POST',
            headers: {
                ...(cartToken ? { 'X-Cart-Token': cartToken } : {}),
            },
            body: JSON.stringify(payload),
        }, authToken || undefined);
    },

    async updateCartItem(
        productId: number,
        payload: { quantity: number; },
        cartToken?: string | null,
        authToken?: string | null,
    ): Promise<{ cart: FrontendCart }> {
        return fetchAuthApi<{ cart: FrontendCart }>(`/cart/items/${productId}`, {
            method: 'PATCH',
            headers: {
                ...(cartToken ? { 'X-Cart-Token': cartToken } : {}),
            },
            body: JSON.stringify(payload),
        }, authToken || undefined);
    },

    async removeCartItem(
        productId: number,
        cartToken?: string | null,
        authToken?: string | null,
    ): Promise<{ cart: FrontendCart }> {
        return fetchAuthApi<{ cart: FrontendCart }>(`/cart/items/${productId}`, {
            method: 'DELETE',
            headers: {
                ...(cartToken ? { 'X-Cart-Token': cartToken } : {}),
            },
        }, authToken || undefined);
    },

    async startCheckout(
        authToken: string,
        payload: {
            customer_name: string;
            customer_email: string;
            customer_phone: string;
            delivery_address: string;
            save_card: boolean;
        },
    ): Promise<CheckoutStartResponse> {
        return fetchAuthApi<CheckoutStartResponse>('/checkout/start', {
            method: 'POST',
            body: JSON.stringify(payload),
        }, authToken);
    },

    async getCheckoutSummary(authToken: string): Promise<CheckoutSummaryResponse> {
        return fetchAuthApi<CheckoutSummaryResponse>('/checkout/summary', {}, authToken);
    },

    async getCheckoutResult(
        authToken: string,
        query: { order_id?: string | null; external_order_id?: string | null; },
    ): Promise<CheckoutResultResponse> {
        const params = new URLSearchParams();

        if (query.order_id) {
            params.set('order_id', query.order_id);
        }

        if (query.external_order_id) {
            params.set('external_order_id', query.external_order_id);
        }

        return fetchAuthApi<CheckoutResultResponse>(`/checkout/result?${params.toString()}`, {}, authToken);
    },

    async startSavedCardCheckout(
        authToken: string,
        payload: { card_id: number; },
    ): Promise<CheckoutStartResponse> {
        return fetchAuthApi<CheckoutStartResponse>('/checkout/cards/pay', {
            method: 'POST',
            body: JSON.stringify(payload),
        }, authToken);
    },

    async setDefaultSavedCard(authToken: string, cardId: number): Promise<{ cards: SavedCard[] }> {
        return fetchAuthApi<{ cards: SavedCard[] }>(`/checkout/cards/${cardId}/default`, {
            method: 'POST',
        }, authToken);
    },

    async deleteSavedCard(authToken: string, cardId: number): Promise<{ cards: SavedCard[] }> {
        return fetchAuthApi<{ cards: SavedCard[] }>(`/checkout/cards/${cardId}`, {
            method: 'DELETE',
        }, authToken);
    },
};
