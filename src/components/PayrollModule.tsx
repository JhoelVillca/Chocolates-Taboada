import React, { useState } from 'react';

// Creative data for employees
const employees = [
  {
    id: 1,
    name: 'Ana Sofia Rojas',
    position: 'Gerente de Proyectos',
    baseSalary: 12000,
    deductions: 1500,
    bonuses: 2000,
    profilePic: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: 2,
    name: 'Luis Fernando Gutierrez',
    position: 'Desarrollador Senior',
    baseSalary: 9500,
    deductions: 1100,
    bonuses: 1500,
    profilePic: 'https://randomuser.me/api/portraits/men/46.jpg',
  },
  {
    id: 3,
    name: 'Maria Isabel Paredes',
    position: 'Diseñadora UX/UI',
    baseSalary: 8000,
    deductions: 900,
    bonuses: 1200,
    profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
];

const PayrollModule = () => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [showPayslip, setShowPayslip] = useState(false);

  const handleEmployeeChange = (event) => {
    setSelectedEmployeeId(event.target.value);
    setShowPayslip(false); // Hide payslip when employee changes
  };

  const generatePayslip = () => {
    if (selectedEmployeeId) {
      setShowPayslip(true);
    }
  };

  const selectedEmployee = employees.find(emp => emp.id === parseInt(selectedEmployeeId));
  const netSalary = selectedEmployee ? selectedEmployee.baseSalary - selectedEmployee.deductions + selectedEmployee.bonuses : 0;

  return (
    <div className="p-6 bg-gray-50 min-h-full font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Gestión de Nóminas</h1>
          <p className="mt-2 text-lg text-gray-600">Administra los pagos de tu equipo con estilo.</p>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-500 ease-in-out">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-grow">
              <label htmlFor="employee-select" className="block text-sm font-medium text-gray-700 mb-1">
                Selecciona un Colaborador
              </label>
              <select
                id="employee-select"
                onChange={handleEmployeeChange}
                value={selectedEmployeeId}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
              >
                <option value="">-- Elige a alguien increíble --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} - {emp.position}</option>
                ))}
              </select>
            </div>
            <button
              onClick={generatePayslip}
              disabled={!selectedEmployeeId}
              className="self-end px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
            >
              Generar Recibo
            </button>
          </div>

          {showPayslip && selectedEmployee && (
            <div className="mt-6 border-t pt-6 animate-fade-in-up">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Recibo de Sueldo Digital</h3>
              <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg bg-gray-50 shadow-inner">
                <div className="flex items-center mb-6">
                  <img src={selectedEmployee.profilePic} alt={selectedEmployee.name} className="w-20 h-20 rounded-full mr-6 border-4 border-white shadow-md"/>
                  <div>
                    <p className="text-xl font-semibold text-gray-900">{selectedEmployee.name}</p>
                    <p className="text-md text-gray-600">{selectedEmployee.position}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-lg text-green-600 mb-2">Ingresos</h4>
                    <div className="flex justify-between"><span>Salario Base:</span> <span className="font-mono">Bs {selectedEmployee.baseSalary.toLocaleString('es-BO')}</span></div>
                    <div className="flex justify-between"><span>Bonificaciones:</span> <span className="font-mono">Bs {selectedEmployee.bonuses.toLocaleString('es-BO')}</span></div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-lg text-red-600 mb-2">Deducciones</h4>
                    <div className="flex justify-between"><span>Retenciones:</span> <span className="font-mono">Bs {selectedEmployee.deductions.toLocaleString('es-BO')}</span></div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-gray-200 text-center">
                  <p className="text-lg font-semibold text-gray-700">Salario Neto a Pagar:</p>
                  <p className="text-3xl font-extrabold text-indigo-600 tracking-wider font-mono">
                    Bs {netSalary.toLocaleString('es-BO')}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center italic">Recibo generado digitalmente. Válido sin firma ni sello.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollModule;
