import React from 'react';
import { 
  Package, 
  ShoppingCart, 
  Factory, 
  BarChart3, 
  Bell,
  User,
  LogOut
} from 'lucide-react';
import useStore from '../store/useStore';

interface LayoutProps {
  children: React.ReactNode;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeModule, onModuleChange }) => {
  const { alerts, generateAlerts } = useStore();

  React.useEffect(() => {
    generateAlerts();
  }, [generateAlerts]);

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'products', name: 'Productos', icon: Package },
    { id: 'sales', name: 'Ventas', icon: ShoppingCart },
    { id: 'production', name: 'Producción', icon: Factory },
  ];

  const criticalAlerts = alerts.filter(alert => alert.severity === 'high').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CT</span>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                Chocolates Taboada
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 hover:text-amber-600 cursor-pointer transition-colors" />
                {criticalAlerts > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {criticalAlerts}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-6 h-6 text-gray-600" />
                <span className="text-gray-700 font-medium">Admin</span>
                <LogOut className="w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen border-r border-amber-200">
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {modules.map((module) => {
                const Icon = module.icon;
                const isActive = activeModule === module.id;
                
                return (
                  <li key={module.id}>
                    <button
                      onClick={() => onModuleChange(module.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200'
                          : 'text-gray-600 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-amber-600' : ''}`} />
                      <span className="font-medium">{module.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;