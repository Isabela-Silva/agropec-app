import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertCircle } from 'lucide-react';
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
  const [loadingRecomendadas, setLoadingRecomendadas] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorRecomendadas, setErrorRecomendadas] = useState<string | null>(null);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        setLoading(true);
        const highlights = await HighlightService.getAllHighlights();
        setDestaques(highlights);
      } catch (err: any) {
        setError('Erro ao carregar destaques');
        console.error('Erro ao carregar destaques:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHighlights();
  }, []);

  useEffect(() => {
    const fetchRecomendadas = async () => {
      try {
        setLoadingRecomendadas(true);
        let atividades = await ActivityService.getAll();
        // Embaralhar array
        atividades = atividades.sort(() => Math.random() - 0.5);
        setRecomendadas(atividades);
      } catch (err) {
        setErrorRecomendadas('Erro ao carregar atividades recomendadas');
        console.error('Erro ao carregar recomendações:', err);
      } finally {
        setLoadingRecomendadas(false);
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
    const id = item.uuid;
    if (!id) return;
    navigate(`/details/${type}/${id}`);
  };

  const handleRecomendadaClick = (atividade: IActivityResponse) => {
    const id = atividade.uuid;
    if (!id) return;
    navigate(`/details/activity/${id}`);
  };

  return (
    <>
      <main
        className="min-h-screen animate-fade-in-up bg-base-white-light text-base-black"
        style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-base-white-light/80 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl px-4">
            <div className="flex items-center justify-between py-4">
              <h1 className="text-2xl font-bold">AgroPec</h1>
              <button
                onClick={handleSearchClick}
                className="rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <Search className="h-6 w-6 text-base-black" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-4 pb-24">
          {/* Destaques Section */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">Destaques</h2>
            
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="ml-3 text-base-gray">Carregando destaques...</p>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center rounded-lg bg-red-50 py-4">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="ml-2 text-red-600">{error}</p>
              </div>
            )}

            {!loading && !error && destaques.length === 0 && (
              <div className="flex items-center justify-center rounded-lg bg-gray-50 py-8">
                <p className="text-base-gray">Nenhum destaque disponível</p>
              </div>
            )}

            {!loading && !error && destaques.length > 0 && (
              <div className="no-scrollbar -mx-4 flex space-x-4 overflow-x-auto px-4 pb-4">
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
                      className="w-72 flex-shrink-0 cursor-pointer transition-transform hover:scale-[0.98]"
                      onClick={() => handleDestaqueClick(destaque)}
                    >
                      <div className="overflow-hidden rounded-lg">
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={item.name} 
                            className="h-40 w-full object-cover transition-transform hover:scale-105" 
                          />
                        ) : (
                          <div className="flex h-40 w-full items-center justify-center bg-gray-100">
                            <span className="text-gray-500">Sem imagem</span>
                          </div>
                        )}
                      </div>
                      <h3 className="mt-2 text-lg font-semibold line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-base-gray line-clamp-2">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Atividades Recomendadas Section */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Atividades recomendadas</h2>
            
            {loadingRecomendadas && (
              <div className="flex items-center justify-center py-8">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="ml-3 text-base-gray">Carregando recomendações...</p>
              </div>
            )}

            {errorRecomendadas && (
              <div className="flex items-center justify-center rounded-lg bg-red-50 py-4">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="ml-2 text-red-600">{errorRecomendadas}</p>
              </div>
            )}

            {!loadingRecomendadas && !errorRecomendadas && recomendadas.length === 0 && (
              <div className="flex items-center justify-center rounded-lg bg-gray-50 py-8">
                <p className="text-base-gray">Nenhuma recomendação disponível</p>
              </div>
            )}

            <div className="space-y-4">
              {!loadingRecomendadas && !errorRecomendadas && recomendadas.map((atividade) => (
                <div
                  key={atividade.uuid}
                  className="flex cursor-pointer items-center space-x-4 rounded-lg border border-transparent bg-white p-4 shadow-sm transition-all hover:border-green-100 hover:bg-green-50 hover:shadow-md"
                  onClick={() => handleRecomendadaClick(atividade)}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold line-clamp-1">{atividade.name}</h3>
                    <p className="text-sm text-base-gray line-clamp-2">{atividade.description}</p>
                  </div>
                  {atividade.imageUrls && atividade.imageUrls[0] && (
                    <img 
                      src={atividade.imageUrls[0]} 
                      alt={atividade.name} 
                      className="h-20 w-24 rounded-lg object-cover flex-shrink-0" 
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={handleSearchModalClose} 
      />
    </>
  );
}
