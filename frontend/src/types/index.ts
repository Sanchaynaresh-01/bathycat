export interface Product {
  id: number;
  name: string;
  description: string;
  base_price: number;
  is_active: boolean;
}

export interface Component {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price_modifier: number;
  weight: number;
  attributes: Record<string, any> | null;
  is_active: boolean;
}

export interface ComponentCategory {
  id: number;
  name: string;
  group?: string;
  step_order: number;
  is_multiple_allowed: boolean;
  components: Component[];
}

export interface ConfigurationCreate {
  name?: string;
  product_id: number;
  selected_components: any[];
}

export interface Configuration {
  id: number;
  name: string;
  product_id: number;
  user_id?: number;
  total_price: number;
  created_at: string;
  selected_components: any[];
  product?: Product;
}

export interface Quote {
  id: number;
  configuration_id: number;
  customer_name: string;
  customer_email: string;
  customer_company?: string;
  customer_country?: string;
  customer_phone?: string;
  status: string;
  created_at: string;
}

export interface QuoteCreate {
  configuration_id: number;
  customer_name: string;
  customer_company?: string;
  customer_country?: string;
  customer_phone?: string;
  customer_email: string;
  project_details?: string;
}
