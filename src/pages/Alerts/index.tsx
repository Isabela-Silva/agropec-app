import { useState } from 'react';
import Header from '../../components/Header';
import BottomNavBar from '../../components/BottomNavBar';
import { Bell, Trash2 } from 'lucide-react';

const initialAlerts = [
  { id: 1, title: 'Cerimônia de Abertura', time: '10:00h' },
  { id: 2, title: 'Pausa para almoço', time: '12:00h' },
  { id: 3, title: 'Workshop: Agricultura Sustentável', time: '14:00h' },
  { id: 4, title: 'Sessão de Networking', time: '16:00h' },
  { id: 5, title: 'Considerações Finais', time: '18:00h' },
];

const AlertsScreen = () => {
  const [alerts, setAlerts] = useState(initialAlerts);

  const handleDelete = (idToDelete: number) => {
    setAlerts((currentAlerts) => currentAlerts.filter((alert) => alert.id !== idToDelete));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28 text-base-black">
      <Header title="Alertas" showBackButton={true} />

      <div className="p-4">
        <div className="space-y-5">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="rounded-lg bg-green-300 p-3">
                  <Bell className="h-6 w-6 text-base-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-base-black">{alert.title}</h3>
                  <p className="text-sm text-gray-500">{alert.time}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(alert.id)} className="p-2">
                <Trash2 className="h-6 w-6 text-red-100" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
};

export default AlertsScreen;
