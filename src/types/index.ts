export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'tabletas' | 'bombones' | 'trufas' | 'otros';
  price: number;
  stock: number;
  minStock: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductionBatch {
  id: string;
  productId: string;
  batchNumber: string;
  quantity: number;
  productionDate: Date;
  expirationDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
  notes?: string;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  customerInfo?: CustomerInfo;
  saleType: 'online' | 'pos';
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CustomerInfo {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  minStock: number;
  type: 'low_stock' | 'out_of_stock' | 'expiring_soon';
  severity: 'low' | 'medium' | 'high';
}

export interface DashboardStats {
  totalSales: number;
  dailySales: number;
  totalProducts: number;
  lowStockItems: number;
  pendingProduction: number;
}