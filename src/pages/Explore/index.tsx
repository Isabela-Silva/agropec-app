import React from "react";
import { Search } from "lucide-react";
import BottomNavBar from "../../components/BottomNavBar";

const destaques = [
    { id: 1, title: "Exposição de Pecuária", description: "Descubra as últimas novidades em criação e gestão de gado.", imageUrl: "https://images.unsplash.com/photo-1507103011901-e954d6ec0988?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 2, title: "Vitrine de Tecno Agrícola", description: "Descubra máquinas agrícolas de ponta.", imageUrl: "https://images.unsplash.com/photo-1594771804886-a933bb2d609b?q=80&w=1182&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
];

const atividadesRecomendadas = [
    { id: 1, title: "Práticas agrícolas sustentáveis", description: "Aprenda sobre técnicas de agricultura ecológica.", imageUrl: "https://images.unsplash.com/photo-1632083000159-8e17b5ae7fd5?q=80&w=1075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 2, title: "Saúde e Nutrição do Gado", description: "Conselhos de especialistas sobre cuidados e alimentação de animais.", imageUrl: "https://images.unsplash.com/photo-1532445697400-f5c10fb93a11?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
];

const ExploreScreen: React.FC = () => {
  return (
    <div className="bg-base-white-light text-base-black min-h-screen pb-28">
      <div className="flex items-center justify-between p-4 pt-6">
        <h1 className="text-2xl font-bold">AgroPec</h1>
        <Search className="w-6 h-6 text-base-black" />
      </div>

      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Destaques</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar">
          {destaques.map((destaque) => (
            <div key={destaque.id} className="flex-shrink-0 w-3/5">
              <img src={destaque.imageUrl} alt={destaque.title} className="w-full h-40 object-cover rounded-lg mb-2" />
              <h3 className="font-semibold text-lg">{destaque.title}</h3>
              <p className="text-base-gray text-sm">{destaque.description}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-6 mb-4">Atividades recomendadas</h2>
        <div className="space-y-4">
          {atividadesRecomendadas.map((atividade) => (
            <div key={atividade.id} className="flex items-center justify-between space-x-4">
              <div className="flex-1">
                <h3 className="font-semibold">{atividade.title}</h3>
                <p className="text-base-gray text-sm">{atividade.description}</p>
              </div>
              <img src={atividade.imageUrl} alt={atividade.title} className="w-24 h-20 object-cover rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
};

export default ExploreScreen;