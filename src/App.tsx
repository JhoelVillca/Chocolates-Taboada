import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProductsModule from './components/ProductsModule';
import SalesModule from './components/SalesModule';
import ProductionModule from './components/ProductionModule';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductsModule />;
      case 'sales':
        return <SalesModule />;
      case 'production':
        return <ProductionModule />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeModule={activeModule} onModuleChange={setActiveModule}>
      {renderModule()}
    </Layout>
  );
}

export default App;