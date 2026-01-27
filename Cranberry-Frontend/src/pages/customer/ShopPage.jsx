import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { productsApi, categories } from '../../services/api';
import { sampleProducts, sampleCategories } from '../../data/sampleData';
import ProductGrid from '../../components/product/ProductGrid';
import AISearchBar from '../../components/ai/SearchBar';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../components/ui/sheet';
import { Checkbox } from '../../components/ui/checkbox';
import { Slider } from '../../components/ui/slider';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest',
    minPrice: 0,
    maxPrice: 5000,
    rating: 0,
  });

  useEffect(() => {
    loadProducts();
  }, [filters]);

  useEffect(() => {
    // Update filters when URL params change
    setFilters(prev => ({
      ...prev,
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
    }));
  }, [searchParams]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const result = await productsApi.getAll({
        search: filters.search,
        category: filters.category,
        sort: filters.sort,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
      });
      // Handle both array response and { products, total } response
      const products = Array.isArray(result) ? result : (result?.products || result || []);
      if (products.length > 0) {
        setProducts(products);
        setTotalProducts(products.length);
      } else {
        // Use sample data if backend returns empty
        useSampleData();
      }
    } catch (error) {
      console.error('Backend offline, using sample data:', error);
      // Use sample data as fallback when backend is offline
      useSampleData();
    } finally {
      setIsLoading(false);
    }
  };

  const useSampleData = () => {
    let filtered = [...sampleProducts];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(p =>
        p.category.toLowerCase().replace(/\s+/g, '-') === filters.category.toLowerCase() ||
        p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.minPrice > 0) {
      filtered = filtered.filter(p => p.price >= filters.minPrice);
    }

    if (filters.maxPrice < 5000) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice);
    }

    // Sorting
    switch (filters.sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setProducts(filtered);
    setTotalProducts(filtered.length);
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));

    // Update URL params for search and category
    if (key === 'search' || key === 'category') {
      if (value) {
        searchParams.set(key, value);
      } else {
        searchParams.delete(key);
      }
      setSearchParams(searchParams);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      sort: 'newest',
      minPrice: 0,
      maxPrice: 5000,
      rating: 0,
    });
    setSearchParams({});
  };

  const hasActiveFilters = filters.search || filters.category || filters.minPrice > 0 || filters.maxPrice < 5000;

  const FilterSidebar = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-display font-semibold text-slate-900 mb-4">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-3">
              <Checkbox
                id={category.id}
                checked={filters.category === category.id}
                onCheckedChange={(checked) =>
                  updateFilter('category', checked ? category.id : '')
                }
                data-testid={`filter-category-${category.id}`}
              />
              <label
                htmlFor={category.id}
                className="text-sm text-slate-600 cursor-pointer flex-1"
              >
                {category.name}
              </label>
              <span className="text-xs text-slate-400">{category.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-display font-semibold text-slate-900 mb-4">Price Range</h3>
        <div className="px-2">
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            min={0}
            max={5000}
            step={50}
            onValueChange={([min, max]) => {
              setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
            }}
            className="mb-4"
            data-testid="price-range-slider"
          />
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>${filters.minPrice}</span>
            <span>${filters.maxPrice}</span>
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="font-display font-semibold text-slate-900 mb-4">Minimum Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-3">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.rating === rating}
                onCheckedChange={(checked) =>
                  updateFilter('rating', checked ? rating : 0)
                }
                data-testid={`filter-rating-${rating}`}
              />
              <label
                htmlFor={`rating-${rating}`}
                className="text-sm text-slate-600 cursor-pointer flex items-center"
              >
                {rating}+ Stars
                <div className="flex ml-2">
                  {[...Array(rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full"
          data-testid="clear-filters"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white" data-testid="shop-page">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-xl mx-auto mb-6">
            <AISearchBar
              variant="default"
              onSearch={(query) => updateFilter('search', query)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">
                {filters.search ? `Search: "${filters.search}"` :
                  filters.category ? categories.find(c => c.id === filters.category)?.name || 'All Products' :
                    'All Products'}
              </h1>
              <p className="text-slate-500 mt-1">
                {totalProducts} {totalProducts === 1 ? 'product' : 'products'} found
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Sort */}
              <Select
                value={filters.sort}
                onValueChange={(value) => updateFilter('sort', value)}
              >
                <SelectTrigger className="w-[180px]" data-testid="sort-select">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile filter button */}
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="lg:hidden"
                    data-testid="mobile-filters-toggle"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <span className="ml-2 w-5 h-5 bg-[#0071E3] text-white text-xs rounded-full flex items-center justify-center">
                        !
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Active filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {filters.search && (
                <span className="inline-flex items-center px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-600">
                  Search: {filters.search}
                  <button onClick={() => updateFilter('search', '')} className="ml-2">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.category && (
                <span className="inline-flex items-center px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-600">
                  {categories.find(c => c.id === filters.category)?.name}
                  <button onClick={() => updateFilter('category', '')} className="ml-2">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {(filters.minPrice > 0 || filters.maxPrice < 5000) && (
                <span className="inline-flex items-center px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-600">
                  ${filters.minPrice} - ${filters.maxPrice}
                  <button onClick={() => setFilters(prev => ({ ...prev, minPrice: 0, maxPrice: 5000 }))} className="ml-2">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <ProductGrid products={products} isLoading={isLoading} columns={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
