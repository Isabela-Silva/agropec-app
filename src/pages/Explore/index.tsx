import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivityService } from '../../services/ActivityService';
import { HighlightService } from '../../services/HighlightService';
import { IActivityResponse } from '../../services/interfaces/activity';
import { IHighlightWithDetails } from '../../services/interfaces/highlight';

export function ExploreScreen() {
  const navigate = useNavigate();
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
      } catch (err: unknown) {
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

  const handleDestaqueClick = (destaque: IHighlightWithDetails) => {
    const item = destaque.activity || destaque.stand;
    if (!item) return;
    const isActivity = 'startTime' in item;
    const type = isActivity ? 'activity' : 'stand';
    const id = item.uuid;
    if (!id) return;
    navigate(`/detalhes/${type}/${id}`);
  };

  const handleRecomendadaClick = (atividade: IActivityResponse) => {
    const id = atividade.uuid;
    if (!id) return;
    navigate(`/detalhes/activity/${id}`);
  };

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
      <section className="mb-8">
        <h2 className="mb-4 text-base font-semibold text-base-black sm:text-lg">Destaques</h2>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="ml-3 text-xs text-base-gray sm:text-sm">Carregando destaques...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center rounded-lg bg-red-50 py-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="ml-2 text-xs text-red-600 sm:text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && destaques.length === 0 && (
          <div className="flex items-center justify-center rounded-lg bg-gray-50 py-8">
            <p className="text-xs text-base-gray sm:text-sm">Nenhum destaque disponível</p>
          </div>
        )}

        {!loading && !error && destaques.length > 0 && (
          <div className="no-scrollbar -mx-4 flex space-x-4 overflow-x-auto px-4 pb-4 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-x-0 lg:overflow-x-visible lg:px-0 lg:pb-0">
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
                  className="w-72 flex-shrink-0 cursor-pointer transition-transform hover:scale-[0.98] lg:w-full"
                  onClick={() => handleDestaqueClick(destaque)}
                >
                  <div className="overflow-hidden rounded-lg">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="h-40 w-full object-cover transition-transform hover:scale-105 lg:h-48"
                      />
                    ) : (
                      <div className="flex h-40 w-full items-center justify-center bg-gray-100 lg:h-48">
                        <span className="text-gray-500">Sem imagem</span>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-2 line-clamp-1 text-sm font-semibold sm:text-base">{item.name}</h3>
                  <p className="line-clamp-2 text-xs text-base-gray sm:text-sm">{item.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Atividades Recomendadas Section */}
      <section>
        <h2 className="mb-4 text-base font-semibold text-base-black sm:text-lg">Atividades recomendadas</h2>

        {loadingRecomendadas && (
          <div className="flex items-center justify-center py-8">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="ml-3 text-xs text-base-gray sm:text-sm">Carregando recomendações...</p>
          </div>
        )}

        {errorRecomendadas && (
          <div className="flex items-center justify-center rounded-lg bg-red-50 py-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="ml-2 text-xs text-red-600 sm:text-sm">{errorRecomendadas}</p>
          </div>
        )}

        {!loadingRecomendadas && !errorRecomendadas && recomendadas.length === 0 && (
          <div className="flex items-center justify-center rounded-lg bg-gray-50 py-8">
            <p className="text-xs text-base-gray sm:text-sm">Nenhuma recomendação disponível</p>
          </div>
        )}

        <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
          {!loadingRecomendadas &&
            !errorRecomendadas &&
            recomendadas.map((atividade) => (
              <div
                key={atividade.uuid}
                className="flex cursor-pointer items-center space-x-4 rounded-lg border border-transparent bg-white p-4 shadow-sm transition-all hover:border-green-100 hover:bg-green-50 hover:shadow-md"
                onClick={() => handleRecomendadaClick(atividade)}
              >
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-1 text-sm font-semibold sm:text-base">{atividade.name}</h3>
                  <p className="line-clamp-2 text-xs text-base-gray sm:text-sm">{atividade.description}</p>
                </div>
                {atividade.imageUrls && atividade.imageUrls[0] && (
                  <img
                    src={atividade.imageUrls[0]}
                    alt={atividade.name}
                    className="h-20 w-24 flex-shrink-0 rounded-lg object-cover lg:h-24 lg:w-32"
                  />
                )}
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
