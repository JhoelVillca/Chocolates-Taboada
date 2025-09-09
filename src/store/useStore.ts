import { create } from 'zustand';
import { Product, ProductionBatch, Sale, InventoryAlert, DashboardStats } from '../types';

interface Store {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (productId: string, quantity: number) => void;

  // Production
  batches: ProductionBatch[];
  addBatch: (batch: Omit<ProductionBatch, 'id'>) => void;
  updateBatch: (id: string, batch: Partial<ProductionBatch>) => void;
  completeBatch: (id: string) => void;

  // Sales
  sales: Sale[];
  currentCart: { productId: string; quantity: number }[];
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  completeSale: (customerInfo?: any) => void;

  // Alerts
  alerts: InventoryAlert[];
  generateAlerts: () => void;

  // Dashboard
  getDashboardStats: () => DashboardStats;
}

const useStore = create<Store>((set, get) => ({
  products: [
    {
      id: '1',
      name: 'Tableta 70% Cacao',
      description: 'Chocolate negro intenso con 70% de cacao ecuatoriano',
      category: 'tabletas',
      price: 35.00,
      stock: 150,
      minStock: 20,
      image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'Bombones Surtidos',
      description: 'Caja de 12 bombones con rellenos variados',
      category: 'bombones',
      price: 65.00,
      stock: 80,
      minStock: 15,
      image: 'https://images.pexels.com/photos/918328/pexels-photo-918328.jpeg',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '3',
      name: 'Trufas de Champagne',
      description: 'Trufas artesanales con champagne Dom Pérignon',
      category: 'trufas',
      price: 120.00,
      stock: 5,
      minStock: 10,
      image: 'https://images.pexels.com/photos/918329/pexels-photo-918329.jpeg',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ],

  batches: [
    {
      id: '1',
      productId: '1',
      batchNumber: 'TAB-001-2024',
      quantity: 50,
      productionDate: new Date('2024-01-15'),
      expirationDate: new Date('2024-07-15'),
      status: 'completed'
    }
  ],

  sales: [],
  currentCart: [],
  alerts: [],

  addProduct: (product) => set((state) => ({
    products: [...state.products, {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }]
  })),

  updateProduct: (id, updatedProduct) => set((state) => ({
    products: state.products.map(p => 
      p.id === id ? { ...p, ...updatedProduct, updatedAt: new Date() } : p
    )
  })),

  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),

  updateStock: (productId, quantity) => set((state) => ({
    products: state.products.map(p =>
      p.id === productId ? { ...p, stock: p.stock + quantity } : p
    )
  })),

  addBatch: (batch) => set((state) => ({
    batches: [...state.batches, { ...batch, id: Date.now().toString() }]
  })),

  updateBatch: (id, updatedBatch) => set((state) => ({
    batches: state.batches.map(b =>
      b.id === id ? { ...b, ...updatedBatch } : b
    )
  })),

  completeBatch: (id) => set((state) => {
    const batch = state.batches.find(b => b.id === id);
    if (batch) {
      get().updateStock(batch.productId, batch.quantity);
    }
    return {
      batches: state.batches.map(b =>
        b.id === id ? { ...b, status: 'completed' } : b
      )
    };
  }),

  addToCart: (productId, quantity) => set((state) => {
    const existingItem = state.currentCart.find(item => item.productId === productId);
    if (existingItem) {
      return {
        currentCart: state.currentCart.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      };
    }
    return {
      currentCart: [...state.currentCart, { productId, quantity }]
    };
  }),

  removeFromCart: (productId) => set((state) => ({
    currentCart: state.currentCart.filter(item => item.productId !== productId)
  })),

  clearCart: () => set({ currentCart: [] }),

  completeSale: (customerInfo) => set((state) => {
    const { products, currentCart } = state;
    const saleItems = currentCart.map(cartItem => {
      const product = products.find(p => p.id === cartItem.productId)!;
      return {
        productId: cartItem.productId,
        productName: product.name,
        quantity: cartItem.quantity,
        price: product.price,
        subtotal: product.price * cartItem.quantity
      };
    });

    const total = saleItems.reduce((sum, item) => sum + item.subtotal, 0);
    const sale: Sale = {
      id: Date.now().toString(),
      items: saleItems,
      total,
      customerInfo,
      saleType: 'online',
      status: 'completed',
      createdAt: new Date()
    };

    // Update stock
    const updatedProducts = products.map(product => {
      const cartItem = currentCart.find(item => item.productId === product.id);
      return cartItem
        ? { ...product, stock: product.stock - cartItem.quantity }
        : product;
    });

    return {
      sales: [...state.sales, sale],
      products: updatedProducts,
      currentCart: []
    };
  }),

  generateAlerts: () => set((state) => {
    const alerts: InventoryAlert[] = [];
    
    state.products.forEach(product => {
      if (product.stock === 0) {
        alerts.push({
          id: `alert-${product.id}-out`,
          productId: product.id,
          productName: product.name,
          currentStock: product.stock,
          minStock: product.minStock,
          type: 'out_of_stock',
          severity: 'high'
        });
      } else if (product.stock <= product.minStock) {
        alerts.push({
          id: `alert-${product.id}-low`,
          productId: product.id,
          productName: product.name,
          currentStock: product.stock,
          minStock: product.minStock,
          type: 'low_stock',
          severity: product.stock < product.minStock * 0.5 ? 'high' : 'medium'
        });
      }
    });

    return { alerts };
  }),

  getDashboardStats: () => {
    const state = get();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dailySales = state.sales
      .filter(sale => sale.createdAt >= today)
      .reduce((sum, sale) => sum + sale.total, 0);

    const totalSales = state.sales.reduce((sum, sale) => sum + sale.total, 0);
    const lowStockItems = state.products.filter(p => p.stock <= p.minStock).length;
    const pendingProduction = state.batches.filter(b => b.status !== 'completed').length;

    return {
      totalSales,
      dailySales,
      totalProducts: state.products.length,
      lowStockItems,
      pendingProduction
    };
  }
}));

export default useStore;