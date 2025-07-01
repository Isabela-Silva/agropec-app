import { Calendar, Clock, LogOut, MapPin, MapPin as MapPinIcon, Phone, User } from 'lucide-react';
import { useState } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import FaqItem from './components/FaqItem';
import InfoItem from './components/InfoItem';

const faqItems = [
  {
    id: 'what',
    question: 'O que é AgroPec?',
    answer:
      'O AgroPec é o principal evento agrícola de Paragominas, apresentando as últimas inovações em agricultura, pecuária e agronegócio.',
  },
  {
    id: 'register',
    question: 'Como se registrar?',
    answer: 'Você pode se registrar através do nosso site oficial ou diretamente no local do evento.',
  },
];

const sponsors = [
  { name: 'Norsk Hydro', logoUrl: 'https://revistaminerios.com/wp-content/uploads/2020/01/hydro-2.png' },
  {
    name: 'Juparanã',
    logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB1XMJPHVEI7tlUsziXIw8gR_UuR0k5247Bg&s',
  },
  {
    name: 'AgroGroup',
    logoUrl: 'https://aweb.marketing/wp-content/uploads/2022/10/logo_agrogoup_link_da_bio_profissional_social.png',
  },
];

export function InfoScreen() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const { user, logout } = useUserAuth();

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-base-white-light text-base-black">
        <div className="flex min-h-[400px] items-center justify-center p-4">
          <div className="text-center">
            <User className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-base text-gray-500">Você precisa estar logado para ver seu perfil.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-white-light text-base-black">
      <div className="space-y-4 p-3 sm:space-y-6 sm:p-4">
        {/* Seção do usuário logado */}
        {user && (
          <>
            {/* Cabeçalho do perfil */}
            <section className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="rounded-full bg-green-500 p-2 sm:p-3">
                  <User className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-base-black sm:text-xl">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-xs text-base-gray sm:text-sm">Bem-vindo ao AgroPec 2025!</p>
                </div>
              </div>
            </section>

            {/* Estatísticas da agenda */}
            <section className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-3 text-base font-semibold text-base-black sm:mb-4 sm:text-lg">Minha Agenda</h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="rounded-lg bg-green-50 p-3 text-center sm:p-4">
                  <Calendar className="mx-auto mb-1 h-5 w-5 text-green-500 sm:mb-2 sm:h-6 sm:w-6" />
                  <p className="text-xs font-medium text-green-700 sm:text-sm">Atividades</p>
                  <p className="text-xl font-bold text-green-600 sm:text-2xl">{user.activitiesId?.length || 0}</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3 text-center sm:p-4">
                  <MapPin className="mx-auto mb-1 h-5 w-5 text-blue-500 sm:mb-2 sm:h-6 sm:w-6" />
                  <p className="text-xs font-medium text-blue-700 sm:text-sm">Stands</p>
                  <p className="text-xl font-bold text-blue-600 sm:text-2xl">{user.standsId?.length || 0}</p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Informações do Evento */}
        <section className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-3 text-base font-semibold text-base-black sm:mb-4 sm:text-lg">Informações do Evento</h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <InfoItem label="Horário" value="9:00h - 18:00h" icon={<Clock className="h-4 w-4" />} />
              <InfoItem label="Data" value="20 a 24 de agosto de 2025" icon={<Calendar className="h-4 w-4" />} />
            </div>
            <InfoItem
              label="Localização"
              value="Centro de Exposições de Paragominas"
              icon={<MapPinIcon className="h-4 w-4" />}
            />
            <InfoItem label="Contato" value="+55 (91) 98765-4321" icon={<Phone className="h-4 w-4" />} />
          </div>
        </section>

        {/* Perguntas frequentes */}
        <section className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-3 text-base font-semibold text-base-black sm:mb-4 sm:text-lg">Perguntas Frequentes</h2>
          <div className="space-y-2">
            {faqItems.map((item) => (
              <FaqItem
                key={item.id}
                item={item}
                isExpanded={expandedFAQ === item.id}
                onClick={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
              />
            ))}
          </div>
        </section>

        {/* Patrocinadores */}
        <section className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-3 text-base font-semibold text-base-black sm:mb-4 sm:text-lg">Patrocinadores</h2>
          <div className="no-scrollbar flex space-x-3 overflow-x-auto pb-2 sm:space-x-4">
            {sponsors.map((sponsor) => (
              <div key={sponsor.name} className="flex-shrink-0 text-center">
                <div className="flex h-20 w-28 items-center justify-center rounded-lg border border-gray-200 bg-base-white p-2 sm:h-24 sm:w-32">
                  <img src={sponsor.logoUrl} alt={sponsor.name} className="max-h-full max-w-full object-contain" />
                </div>
                <p className="mt-1 text-xs font-semibold sm:mt-2 sm:text-sm">{sponsor.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ações do usuário */}
        {user && (
          <section className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-3 text-base font-semibold text-base-black sm:mb-4 sm:text-lg">Ações</h2>
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 sm:px-4 sm:py-3"
              >
                <LogOut className="h-4 w-4" />
                Sair da conta
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
