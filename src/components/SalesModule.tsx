import React, { useState } from 'react';
import { ShoppingCart, CreditCard, User, Plus, Minus, X, Store, Globe } from 'lucide-react';
import useStore from '../store/useStore';

const SalesModule: React.FC = () => {
  const { products, currentCart, addToCart, removeFromCart, completeSale, clearCart } = useStore();
  const [salesView, setSalesView] = useState<'pos' | 'ecommerce'>('pos');
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const cartItems = currentCart.map(cartItem => {
    const product = products.find(p => p.id === cartItem.productId)!;
    return {
      ...product,
      quantity: cartItem.quantity,
      subtotal: product.price * cartItem.quantity
    };
  });

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      const currentItem = currentCart.find(item => item.productId === productId);
      const currentQuantity = currentItem ? currentItem.quantity : 0;
      const difference = newQuantity - currentQuantity;
      
      if (difference > 0) {
        addToCart(productId, difference);
      } else if (difference < 0) {
        // Remove items - this is a simplified implementation
        removeFromCart(productId);
        if (newQuantity > 0) {
          addToCart(productId, newQuantity);
        }
      }
    }
  };

  const handleCompleteSale = () => {
    completeSale(salesView === 'ecommerce' ? customerInfo : undefined);
    setShowCheckout(false);
    setCustomerInfo({ name: '', email: '', phone: '', address: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Sistema de Ventas</h1>
        
        {/* Sales View Toggle */}
        <div className="bg-white rounded-lg border border-amber-200 p-1">
          <div className="flex">
            <button
              onClick={() => setSalesView('pos')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${
                salesView === 'pos'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-amber-600'
              }`}
            >
              <Store className="w-4 h-4 mr-2" />
              POS Tienda
            </button>
            <button
              onClick={() => setSalesView('ecommerce')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${
                salesView === 'ecommerce'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-amber-600'
              }`}
            >
              <Globe className="w-4 h-4 mr-2" />
              E-commerce
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products Catalog */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Catálogo de Productos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-amber-300 hover:shadow-md transition-all duration-200"
                >
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-md mb-3 flex items-center justify-center">
                      <ShoppingCart className="w-8 h-8 text-amber-400" />
                    </div>
                  )}
                  
                  <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-amber-600">Bs {product.price.toFixed(2)}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      product.stock > product.minStock 
                        ? 'bg-green-100 text-green-700'
                        : product.stock > 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      Stock: {product.stock}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => addToCart(product.id, 1)}
                    disabled={product.stock === 0}
                    className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar al Carrito
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shopping Cart */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2 text-amber-600" />
                Carrito
              </h2>
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Limpiar
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-600">Bs {item.price.toFixed(2)} c/u</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center hover:bg-amber-300 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-6 h-6 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center hover:bg-amber-300 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-6 h-6 rounded-full bg-red-200 text-red-700 flex items-center justify-center hover:bg-red-300 transition-colors ml-2"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">El carrito está vacío</p>
              )}
            </div>

            {cartItems.length > 0 && (
              <>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-amber-600">Bs {total.toFixed(2)}</span>
                  </div>
                  
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Procesar Venta
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Finalizar Venta</h2>
              
              {/* Order Summary */}
              <div className="bg-amber-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Resumen del Pedido</h3>
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span>Bs {item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-amber-200 pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>Bs {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Customer Information (E-commerce only) */}
              {salesView === 'ecommerce' && (
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Información del Cliente
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    
                    <input
                      type="email"
                      placeholder="Email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    
                    <input
                      type="tel"
                      placeholder="Teléfono"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    
                    <input
                      type="text"
                      placeholder="Dirección"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCompleteSale}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200"
                >
                  Confirmar Venta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesModule;