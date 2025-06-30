import { useState } from 'react';
import Header from '../../components/Header';
import FaqItem from './components/FaqItem';
import InfoItem from './components/InfoItem';

const userProfile = {
  name: 'José Pires de Oliveira Neto',
  email: 'jose.pj.pires-teste@gmail.com',
};

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

  return (
    <main className="min-h-screen bg-base-white-light text-base-black">
      <Header title="AgroPec 2025" showBackButton={true} />
      <div className="mx-auto max-w-4xl px-4 pb-8">
        <section className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold">Informações de perfil</h2>
          <div className="space-y-4">
            <InfoItem label="Nome" value={userProfile.name} />
            <InfoItem label="E-mail" value={userProfile.email} />
          </div>
        </section>

        <section className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold">Informações do Evento</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem label="Tempo" value="9:00h - 18:00h" />
              <InfoItem label="Data" value="20 a 24 de agosto de 2025" />
            </div>
            <InfoItem label="Localização" value="Centro de Exposições de Paragominas" />
            <InfoItem label="Contato" value="+55 (91) 98765-4321" />
          </div>
        </section>

        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold">Perguntas frequentes</h2>
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

        <section>
          <h2 className="mb-4 text-2xl font-bold">Patrocinadores</h2>
          <div className="no-scrollbar flex space-x-4 overflow-x-auto pb-2">
            {sponsors.map((sponsor) => (
              <div key={sponsor.name} className="flex-shrink-0 text-center">
                <div className="flex h-24 w-32 items-center justify-center rounded-lg border border-gray-200 bg-base-white p-2">
                  <img src={sponsor.logoUrl} alt={sponsor.name} className="max-h-full max-w-full object-contain" />
                </div>
                <p className="mt-2 text-sm font-semibold">{sponsor.name}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
