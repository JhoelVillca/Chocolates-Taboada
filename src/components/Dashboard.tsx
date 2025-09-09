import React from 'react';
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  Clock,
  DollarSign,
  ShoppingBag
} from 'lucide-react';
import useStore from '../store/useStore';

const Dashboard: React.FC = () => {
  const { products, sales, alerts, getDashboardStats } = useStore();
  const stats = getDashboardStats();

  const recentSales = sales.slice(-5).reverse();
  const topProducts = products
    .map(product => {
      const soldQuantity = sales.reduce((total, sale) => {
        const item = sale.items.find(item => item.productId === product.id);
        return total + (item ? item.quantity : 0);
      }, 0);
      return { ...product, soldQuantity };
    })
    .sort((a, b) => b.soldQuantity - a.soldQuantity)
    .slice(0, 5);

  const criticalAlerts = alerts.filter(alert => alert.severity === 'high');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
        <div className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ventas Totales</p>
              <p className="text-3xl font-bold text-gray-900">Bs {stats.totalSales.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ventas Hoy</p>
              <p className="text-3xl font-bold text-gray-900">Bs {stats.dailySales.toFixed(2)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Productos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Package className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
              <p className="text-3xl font-bold text-red-600">{stats.lowStockItems}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {criticalAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <h2 className="text-lg font-semibold text-red-900">Alertas Críticas</h2>
          </div>
          <div className="space-y-2">
            {criticalAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                <span className="font-medium text-gray-900">{alert.productName}</span>
                <span className="text-sm text-red-600">
                  {alert.type === 'out_of_stock' ? 'Sin stock' : `Stock bajo: ${alert.currentStock}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-amber-600" />
            Productos Más Vendidos
          </h2>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-600">{product.soldQuantity}</p>
                  <p className="text-xs text-gray-500">vendidos</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-green-600" />
            Ventas Recientes
          </h2>
          <div className="space-y-3">
            {recentSales.length > 0 ? (
              recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">#{sale.id}</p>
                    <p className="text-sm text-gray-600">
                      {sale.items.length} producto{sale.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">Bs {sale.total.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      {sale.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No hay ventas registradas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;