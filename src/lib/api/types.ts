// ============================================================
// API Response Interfaces (Matching Laravel Backend)
// ============================================================

export interface BootstrapResponse {
    locale: string;
    defaultLocale: string;
    languages: Language[];
    navigation: {
        header: MenuItem[];
        footer: MenuItem[];
    };
    settings: {
        headerLogo: string | null;
        footerLogo: string | null;
        footerContactText: string | null;
        footerContactByLocale: Record<string, string> | null;
    };
    routeMap: Array<{
        id: number;
        slug: string;
        is_home?: boolean;
        title: string;
        template: string;
        url: string;
        api_url: string;
    }>;
}

export interface Language {
    code: string;
    name: string;
    english_name: string;
    flag: string;
    country_code: string;
    direction: 'ltr' | 'rtl' | string;
    is_default: boolean;
    is_active: boolean;
}

export interface FrontendUser {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

export interface AuthResponse {
    token: string;
    user: FrontendUser;
}

export interface FrontendCartItem {
    product_id: number;
    slug?: string | null;
    name: string;
    image?: string | null;
    category: string;
    quantity: number;
    unit_price: number;
    line_total: number;
}

export interface FrontendCart {
    token: string;
    items: FrontendCartItem[];
    total: number;
    total_formatted: string;
    count: number;
    currency: string;
}

export interface CheckoutStartResponse {
    redirect_url: string;
    bog_order_id: string;
    external_order_id: string;
}

export interface SavedCard {
    id: number;
    card_mask: string | null;
    card_brand: string | null;
    card_type: string | null;
    card_holder_name: string | null;
    expiry_month: string | null;
    expiry_year: string | null;
    formatted_expiry: string;
    is_default: boolean;
    parent_order_id: string | null;
}

export interface CheckoutSummaryResponse {
    items: FrontendCartItem[];
    total: number;
    total_formatted: string;
    currency: string;
    cards: SavedCard[];
}

export interface CheckoutResultResponse {
    payment: {
        bog_order_id: string;
        external_order_id: string;
        status: string;
        amount: number;
        currency: string;
        save_card_requested: boolean;
        verified_at: string | null;
    };
}

export interface MenuItem {
    label: string;
    url: string;
    type: 'page' | 'post' | 'custom' | 'product';
    reference_id?: number | string;
    children?: MenuItem[];
    slug?: string;
    api_url?: string;
}

export interface Block {
    type: string;
    label?: string | null;
    description?: string | null;
    sort_order?: number;
    data: Record<string, any>;
}

export interface SEO {
    meta_title: string | null;
    meta_description: string | null;
    keywords: string | null;
    canonical_url: string | null;
}

export interface PostRelation {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    feature_image: string | null;
    category: string;
    published_at: string;
}

export interface ProductRelation {
    id: number;
    slug: string;
    title: string;
    excerpt?: string;
    content?: string;
    price: number;
    old_price: number | null;
    on_sale: boolean;
    is_featured?: boolean;
    brand: string;
    feature_image: string | null;
    category: string;
    colors: string[]; // Changed from optional to required
    blocks: Block[];
}

export interface ReelRelation {
    id: number;
    title: string;
    description: string;
    image: string | null;
    video_url: string | null;
    category: string;
    category_label?: string;
}

export interface PageResponse {
    page: {
        id: number;
        is_home?: boolean;
        slug: string;
        title: string;
        description: string;
        template: string;
        blocks: Block[];
    };
    relations: {
        posts: PostRelation[];
        products: ProductRelation[];
        reels: ReelRelation[];
    };
    seo: SEO;
}

export interface PostResponse {
    post: {
        id: number;
        slug: string;
        title: string;
        content: string;
        excerpt: string;
        category: string;
        published_at: string;
        feature_image: string | null;
        blocks: Block[];
    };
    relations: {
        posts: PostRelation[];
    };
    seo: SEO;
}

export interface ProductResponse {
    product: {
        id: number;
        slug: string;
        title: string;
        description: string;
        content: string;
        price: number;
        old_price: number | null;
        on_sale: boolean;
        is_featured: boolean;
        brand: string;
        category: string;
        cover_image: string | null;
        feature_image: string | null;
        gallery: string[];
        colors: string[];
        blocks: Block[];
    };
    seo: SEO;
}
