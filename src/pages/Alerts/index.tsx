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

      <div className="mx-auto max-w-4xl px-4">
        {alerts.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-sm">
            <Bell className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Nenhum alerta</h3>
            <p className="mt-1 text-sm text-gray-500">Você não tem alertas no momento.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="mb-4 overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md">
              <div className="p-4">
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
            </div>
          ))
        )}
      </div>
    </main>
  );
}
