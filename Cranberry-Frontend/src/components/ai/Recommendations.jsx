import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAIRecommend } from '../../hooks/useAI';
import ProductCard from '../product/ProductCard';
import { Skeleton } from '../ui/skeleton';

const AIRecommendations = ({ productId = null, title = 'Recommended for You', limit = 4 }) => {
  const { recommendations, getRecommendations, getPersonalizedRecommendations, isLoading } = useAIRecommend();

  useEffect(() => {
    if (productId) {
      getRecommendations(productId, limit);
    } else {
      getPersonalizedRecommendations(null, limit);
    }
  }, [productId, limit, getRecommendations, getPersonalizedRecommendations]);

  if (isLoading) {
    return (
      <section className="py-12" data-testid="ai-recommendations-loading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 mb-8">
            <Sparkles className="h-5 w-5 text-[#0071E3]" />
            <h2 className="font-display text-2xl font-semibold text-slate-900">{title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-12" data-testid="ai-recommendations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0071E3] to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-slate-900">{title}</h2>
              <p className="text-sm text-slate-500">Powered by AI recommendations</p>
            </div>
          </div>
          <Link
            to="/shop"
            className="hidden sm:flex items-center space-x-2 text-[#0071E3] hover:text-[#0077ED] transition-colors"
          >
            <span className="font-medium">View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {recommendations.map((product) => (
            <ProductCard key={product.id} product={product} showAIBadge />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 text-[#0071E3] hover:text-[#0077ED] transition-colors"
          >
            <span className="font-medium">View All Products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AIRecommendations;
