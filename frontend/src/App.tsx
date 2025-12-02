import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { UserManagement } from './components/UserManagement';
import { GymManagement } from './components/GymManagement';
import { MembershipManagement } from './components/MembershipManagement';
import { Toast } from './components/Toast';
import { useToast } from './hooks/useToast';

type ActiveTab = 'dashboard' | 'users' | 'gyms' | 'memberships';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const { toasts, removeToast } = useToast();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'gyms':
        return <GymManagement />;
      case 'memberships':
        return <MembershipManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
      
      <nav className="bg-white shadow-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">💪</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Fitness Platform
                </h1>
              </div>
            </div>
            <div className="flex space-x-1">
              {[
                { key: 'dashboard', label: 'Dashboard', icon: '📊' },
                { key: 'users', label: 'Users', icon: '👥' },
                { key: 'gyms', label: 'Gyms', icon: '🏋️' },
                { key: 'memberships', label: 'Memberships', icon: '🎫' }
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as ActiveTab)}
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === key
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;