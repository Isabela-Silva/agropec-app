import React from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center px-6">
      <div className="mb-8">
        <div className="w-48 h-48 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
          <div className="text-6xl font-bold text-white">AGROPEC</div>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-center">
        Bem-Vindo(a) a AgroPec
      </h1>
      <p className="text-gray-300 text-center mb-8 max-w-sm">
        Conheça as últimas novidades em agricultura e pecuária no principal
        evento de Paragominas.
      </p>
      <button
        onClick={() => navigate("/explore")}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-full w-full max-w-xs transition-colors"
      >
        Entrar no evento
      </button>
    </div>
  );
};

export default SplashScreen;