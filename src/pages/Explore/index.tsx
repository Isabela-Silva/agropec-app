import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { SearchModal } from '../../components/SearchModal';
import { HighlightService } from '../../services/HighlightService';
import { ActivityService } from '../../services/ActivityService';
import { IHighlightWithDetails } from '../../services/interfaces/highlight';
import { IActivityResponse } from '../../services/interfaces/activity';
import { IStandResponse } from '../../services/interfaces/stand';

export function ExploreScreen() {
  const navigate = useNavigate();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [destaques, setDestaques] = useState<IHighlightWithDetails[]>([]);
  const [recomendadas, setRecomendadas] = useState<IActivityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        setLoading(true);
        const highlights = await HighlightService.getAllHighlights();
        console.log(highlights);
        setDestaques(highlights);
      } catch (err: any) {
        setError('Erro ao carregar destaques');
      } finally {
        setLoading(false);
      }
    };
    fetchHighlights();
  }, []);

  useEffect(() => {
    const fetchRecomendadas = async () => {
      try {
        let atividades = await ActivityService.getAllActivities();
        // Embaralhar array
        atividades = atividades.sort(() => Math.random() - 0.5);
        setRecomendadas(atividades);
      } catch (err) {
        // Silenciar erro
      }
    };
    fetchRecomendadas();
  }, []);

  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
  };

  const handleSearchModalClose = () => {
    setIsSearchModalOpen(false);
  };

  const handleDestaqueClick = (destaque: IHighlightWithDetails) => {
    const item = destaque.activity || destaque.stand;
    if (!item) return;
    const isActivity = 'startTime' in item;
    const type = isActivity ? 'activity' : 'stand';
    const id = (item as any).uuid || (item as any)._id;
    if (!id) return;
    navigate(`/details/${type}/${id}`);
  };

  const handleRecomendadaClick = (atividade: IActivityResponse) => {
    const id = atividade.uuid || atividade._id;
    if (!id) return;
    navigate(`/details/activity/${id}`);
  };

  return (
    <>
      <main
        className="min-h-screen animate-fade-in-up bg-base-white-light text-base-black"
        style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}
      >
        <div className="flex items-center justify-between p-4 pt-6">
          <h1 className="text-2xl font-bold">AgroPec</h1>
          <button
            onClick={handleSearchClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Search className="h-6 w-6 text-base-black" />
          </button>
        </div>

        <div className="p-4">
          <h2 className="mb-4 text-2xl font-bold">Destaques</h2>
          
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-base-gray">Carregando destaques...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {!loading && !error && destaques.length === 0 && (
            <div className="text-center py-8">
              <p className="text-base-gray">Nenhum destaque disponível</p>
            </div>
          )}

          {!loading && !error && destaques.length > 0 && (
            <div className="no-scrollbar flex space-x-4 overflow-x-auto pb-4">
              {destaques.map((destaque) => {
                const item = destaque.activity || destaque.stand;
                if (!item) return null;

                let imageUrl: string | undefined;
                const images = item.imageUrls;
          
                if (Array.isArray(images)) {
                  imageUrl = images[0];
                } else {
                  imageUrl = images;
                }

                return (
                  <div 
                    key={destaque._id} 
                    className="w-3/5 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleDestaqueClick(destaque)}
                  >
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={item.name} 
                        className="mb-2 h-40 w-full rounded-lg object-cover" 
                      />
                    ) : (
                      <div className="mb-2 h-40 w-full rounded-lg bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Sem imagem</span>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-base-gray">{item.description}</p>
                  </div>
                );
              })}
            </div>
          )}

          <h2 className="mb-4 mt-6 text-2xl font-bold">Atividades recomendadas</h2>
          <div className="space-y-4">
            {recomendadas.length === 0 && (
              <div className="text-center text-base-gray">Nenhuma recomendação disponível</div>
            )}
            {recomendadas.map((atividade) => (
              <div
                key={atividade.uuid || atividade._id}
                className="flex items-center justify-between space-x-4 cursor-pointer hover:bg-green-50 rounded-lg p-2 transition"
                onClick={() => handleRecomendadaClick(atividade)}
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{atividade.name}</h3>
                  <p className="text-sm text-base-gray">{atividade.description}</p>
                </div>
                {atividade.imageUrls && atividade.imageUrls[0] && (
                  <img src={atividade.imageUrls[0]} alt={atividade.name} className="h-20 w-24 rounded-lg object-cover" />
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={handleSearchModalClose} 
      />
    </>
  );
}
