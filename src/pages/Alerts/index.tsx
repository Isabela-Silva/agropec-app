import { Bell, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Header from '../../components/Header';

export function AlertsScreen() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: 'Alerta de Chuva',
      description: 'Previsão de chuva forte para amanhã. Proteja seus equipamentos.',
      date: '2024-03-15',
    },
    {
      id: 2,
      title: 'Manutenção de Equipamento',
      description: 'É hora de fazer a manutenção do seu trator.',
      date: '2024-03-14',
    },
  ]);

  const handleDelete = (idToDelete: number) => {
    setAlerts(alerts.filter((alert) => alert.id !== idToDelete));
  };

  return (
    <main className="min-h-screen bg-base-white-light">
      <Header title="Alertas" showBackButton={true} />

      <div className="p-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="mb-4 rounded-lg bg-white p-4 shadow-md transition-all hover:shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-500 p-2">
                  <Bell className="h-5 w-5 text-base-white" />
                </div>
                <h3 className="text-lg font-semibold">{alert.title}</h3>
              </div>
              <button
                onClick={() => handleDelete(alert.id)}
                className="rounded-full p-2 transition-colors hover:bg-red-50"
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </button>
            </div>
            <p className="mb-2 text-sm text-base-gray">{alert.description}</p>
            <p className="text-xs text-base-gray">{alert.date}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
