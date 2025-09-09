import React, { useState } from 'react';
import { Factory, Plus, Calendar, Package2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import useStore from '../store/useStore';
import { ProductionBatch } from '../types';

const ProductionModule: React.FC = () => {
  const { products, batches, addBatch, updateBatch, completeBatch } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 0,
    productionDate: new Date().toISOString().split('T')[0],
    expirationDate: '',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      productId: '',
      quantity: 0,
      productionDate: new Date().toISOString().split('T')[0],
      expirationDate: '',
      notes: ''
    });
    setShowForm(false);
  };

  const generateBatchNumber = (productId: string) => {
    const product = products.find(p => p.id === productId);
    const productCode = product?.name.substring(0, 3).toUpperCase() || 'PRD';
    const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const sequence = batches.filter(b => b.productId === productId).length + 1;
    return `${productCode}-${date}-${sequence.toString().padStart(3, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const batchNumber = generateBatchNumber(formData.productId);
    
    addBatch({
      ...formData,
      batchNumber,
      productionDate: new Date(formData.productionDate),
      expirationDate: new Date(formData.expirationDate),
      status: 'pending'
    });
    
    resetForm();
  };

  const handleCompleteBatch = (batchId: string) => {
    completeBatch(batchId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in-progress':
        return <Factory className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilExpiration = (expirationDate: Date) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Producción</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center shadow-md"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Orden de Producción
        </button>
      </div>

      {/* Production Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lotes Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600">
                {batches.filter(b => b.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Producción</p>
              <p className="text-3xl font-bold text-blue-600">
                {batches.filter(b => b.status === 'in-progress').length}
              </p>
            </div>
            <Factory className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completados</p>
              <p className="text-3xl font-bold text-green-600">
                {batches.filter(b => b.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
      </div>

      {/* Production Batches */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Lotes de Producción</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Lote</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Producto</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Cantidad</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">F. Producción</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">F. Vencimiento</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Estado</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {batches.length > 0 ? (
                batches.map((batch) => {
                  const product = products.find(p => p.id === batch.productId);
                  const daysUntilExpiration = getDaysUntilExpiration(batch.expirationDate);
                  
                  return (
                    <tr key={batch.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm text-blue-600">{batch.batchNumber}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-900">{product?.name || 'Producto no encontrado'}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-700">{batch.quantity} unidades</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-700">{batch.productionDate.toLocaleDateString()}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <span className="text-gray-700 mr-2">{batch.expirationDate.toLocaleDateString()}</span>
                          {daysUntilExpiration < 30 && batch.status === 'completed' && (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              daysUntilExpiration < 7 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {daysUntilExpiration < 0 ? 'Vencido' : `${daysUntilExpiration}d`}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          {getStatusIcon(batch.status)}
                          <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(batch.status)}`}>
                            {batch.status === 'in-progress' ? 'En Proceso' : 
                             batch.status === 'completed' ? 'Completado' : 'Pendiente'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {batch.status === 'pending' && (
                          <button
                            onClick={() => updateBatch(batch.id, { status: 'in-progress' })}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors text-sm mr-2"
                          >
                            Iniciar
                          </button>
                        )}
                        {batch.status === 'in-progress' && (
                          <button
                            onClick={() => handleCompleteBatch(batch.id)}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors text-sm"
                          >
                            Completar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No hay lotes de producción registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Production Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nueva Orden de Producción</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Producto a Fabricar
                  </label>
                  <select
                    required
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar producto...</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - Stock actual: {product.stock}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cantidad a Producir
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Producción
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.productionDate}
                      onChange={(e) => setFormData({ ...formData, productionDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.expirationDate}
                    onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                    min={formData.productionDate}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas (opcional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Notas adicionales sobre la producción..."
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                  >
                    Crear Orden de Producción
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionModule;