import { Calendar } from "lucide-react";
import Header from "../../components/Header";
import BottomNavBar from "../../components/BottomNavBar";

const AgendaScreen = () => (
  <div className="bg-base-white-light text-base-black min-h-screen pb-24">
    <Header title="Agenda" showBackButton={true} />

    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Sexta-feira, 23 de agosto</h2>
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-green-500 p-3 rounded-lg">
            <Calendar className="w-6 h-6 text-base-white" />
          </div>
          <div>
            <h3 className="font-semibold text-base-black">
              Cerimônia de Abertura
            </h3>
            <p className="text-base-gray text-sm">10:00h - 11:00h</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-green-500 p-3 rounded-lg">
            <Calendar className="w-6 h-6 text-base-white" />
          </div>
          <div>
            <h3 className="font-semibold text-base-black">
              Palestra: Agricultura Sustentável
            </h3>
            <p className="text-base-gray text-sm">11:30h - 12:30h</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-green-500 p-3 rounded-lg">
            <Calendar className="w-6 h-6 text-base-white" />
          </div>
          <div>
            <h3 className="font-semibold text-base-black">
              Workshop: Gestão do Solo
            </h3>
            <p className="text-base-gray text-sm">14:00h - 15:00h</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-green-500 p-3 rounded-lg">
            <Calendar className="w-6 h-6 text-base-white" />
          </div>
          <div>
            <h3 className="font-semibold text-base-black">
              Mostrar: Música Local
            </h3>
            <p className="text-base-gray text-sm">16:00h - 17:00h</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Sábado, 24 de agosto</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="bg-green-500 p-3 rounded-lg">
            <Calendar className="w-6 h-6 text-base-white" />
          </div>
          <div>
            <h3 className="font-semibold text-base-black">
              Palestra: Inovação Pecuária
            </h3>
            <p className="text-base-gray text-sm">10:00h - 11:00h</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-green-500 p-3 rounded-lg">
            <Calendar className="w-6 h-6 text-base-white" />
          </div>
          <div>
            <h3 className="font-semibold text-base-black">
              Workshop: Saúde Animal
            </h3>
            <p className="text-base-gray text-sm">11:30h - 12:30h</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-green-500 p-3 rounded-lg">
            <Calendar className="w-6 h-6 text-base-white" />
          </div>
          <div>
            <h3 className="font-semibold text-base-black">
              Palestra: Tendências de Mercado
            </h3>
            <p className="text-base-gray text-sm">14:00h - 15:00h</p>
          </div>
        </div>
      </div>
    </div>

    <BottomNavBar />
  </div>
);

export default AgendaScreen;
