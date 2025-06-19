import React, { useState } from 'react';
import Header from '../../components/Header';
import BottomNavBar from '../../components/BottomNavBar';
import FaqItem from './components/FaqItem';
import InfoItem from './components/InfoItem';

const userProfile = {
    name: 'José Pires de Oliveira Neto',
    email: 'jose.pj.pires-teste@gmail.com',
};

const faqItems = [
    { id: 'what', question: 'O que é AgroPec?', answer: 'O AgroPec é o principal evento agrícola de Paragominas, apresentando as últimas inovações em agricultura, pecuária e agronegócio.' },
    { id: 'register', question: 'Como se registrar?', answer: 'Você pode se registrar através do nosso site oficial ou diretamente no local do evento.' },
];

const sponsors = [
    { name: 'Norsk Hydro', logoUrl: 'https://revistaminerios.com/wp-content/uploads/2020/01/hydro-2.png' },
    { name: 'Juparanã', logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB1XMJPHVEI7tlUsziXIw8gR_UuR0k5247Bg&s' },
    { name: 'AgroGroup', logoUrl: 'https://aweb.marketing/wp-content/uploads/2022/10/logo_agrogoup_link_da_bio_profissional_social.png' },
];

const InfoScreen: React.FC = () => {
    const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);


    return (
        <div className="bg-base-white-light text-base-black min-h-screen pb-28">
            <Header title="AgroPec 2025" showBackButton={true} />
            <div className="p-4 space-y-6">
                <section>
                    <h2 className="text-2xl font-bold mb-4">Informações de perfil</h2>
                    <div className="space-y-4">
                        <InfoItem label="Nome" value={userProfile.name} />
                        <InfoItem label="E-mail" value={userProfile.email} />
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Informações do Evento</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InfoItem label="Tempo" value="9:00h - 18:00h" />
                            <InfoItem label="Data" value="20 a 24 de agosto de 2025" />
                        </div>
                        <InfoItem label="Localização" value="Centro de Exposições de Paragominas" />
                        <InfoItem label="Contato" value="+55 (91) 98765-4321" />
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Perguntas frequentes</h2>
                    <div className="space-y-2">
                        {faqItems.map(item => (
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
                    <h2 className="text-2xl font-bold mb-4">Patrocinadores</h2>
                    <div className="flex overflow-x-auto space-x-4 pb-2 no-scrollbar">
                        {sponsors.map((sponsor) => (
                            <div key={sponsor.name} className="flex-shrink-0 text-center">
                                <div className="bg-base-white border border-gray-200 rounded-lg w-32 h-24 flex items-center justify-center p-2">
                                    <img src={sponsor.logoUrl} alt={sponsor.name} className="max-w-full max-h-full object-contain" />
                                </div>
                                <p className="mt-2 font-semibold text-sm">{sponsor.name}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <BottomNavBar />
        </div>
    );
};

export default InfoScreen;