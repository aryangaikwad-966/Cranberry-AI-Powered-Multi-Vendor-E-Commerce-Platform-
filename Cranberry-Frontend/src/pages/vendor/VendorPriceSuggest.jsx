import { useState } from 'react';
import { Sparkles, DollarSign, TrendingUp, Info } from 'lucide-react';
import { useAIPriceSuggest } from '../../hooks/useAI';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';

const VendorPriceSuggest = () => {
  const { suggestion, getSuggestion, isAnalyzing } = useAIPriceSuggest();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = async () => {
    await getSuggestion({
      ...formData,
      price: parseFloat(formData.price) || 0,
    });
  };

  return (
    <div className="space-y-8" data-testid="vendor-price-suggest">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0071E3] to-indigo-600 rounded-xl flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">
              AI Price Suggestions
            </h1>
            <p className="text-slate-500">Get intelligent pricing recommendations</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>
              Enter your product details to get AI-powered pricing suggestions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Wireless Bluetooth Headphones"
                className="mt-1"
                data-testid="price-product-name"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 w-full h-10 px-3 rounded-md border border-slate-200 bg-white"
                data-testid="price-category-select"
              >
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Beauty">Beauty</option>
              </select>
            </div>
            <div>
              <Label htmlFor="price">Your Intended Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="99.99"
                className="mt-1"
                data-testid="price-input"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of your product..."
                rows={3}
                className="mt-1 w-full px-3 py-2 rounded-md border border-slate-200 bg-white resize-none"
                data-testid="price-description"
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={!formData.name || !formData.price || isAnalyzing}
              className="w-full bg-[#0071E3] hover:bg-[#0077ED]"
              data-testid="analyze-price-button"
            >
              {isAnalyzing ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing...
                </span>
              ) : (
                <span className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get AI Suggestion
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {suggestion ? (
            <>
              {/* Recommendation Card */}
              <Card className="border-[#0071E3] border-2">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-[#0071E3]">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Recommended Price
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <p className="font-display text-5xl font-bold text-slate-900">
                      ${suggestion.recommendedPrice?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-slate-500 mt-2">
                      Range: ${suggestion.priceRange?.min?.toFixed(2) || '0.00'} - ${suggestion.priceRange?.max?.toFixed(2) || '0.00'}
                    </p>
                  </div>

                  {/* Confidence Score */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">AI Confidence</span>
                      <span className="text-sm font-medium text-slate-900">
                        {Math.round((suggestion.confidence || 0) * 100)}%
                      </span>
                    </div>
                    <Progress value={(suggestion.confidence || 0) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Cranberry Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-[#0071E3]" />
                    Cranberry Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-sm text-slate-500">Cranberry Average</p>
                      <p className="font-display text-xl font-bold text-slate-900">
                        ${suggestion.competitorAnalysis?.averagePrice?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-sm text-slate-500">Products Analyzed</p>
                      <p className="font-display text-xl font-bold text-slate-900">
                        {suggestion.competitorAnalysis?.productsAnalyzed || 0}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">Your Position</p>
                    <p className="font-display text-xl font-bold text-slate-900">
                      {suggestion.competitorAnalysis?.cranberryPosition || 'N/A'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="h-5 w-5 mr-2 text-[#0071E3]" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {suggestion.insights?.map((insight, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-[#0071E3] text-sm flex items-center justify-center flex-shrink-0 mr-3">
                          {index + 1}
                        </span>
                        <span className="text-slate-600">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="font-medium text-slate-900 mb-2">
                  Get AI-Powered Pricing
                </h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                  Enter your product details and let our AI analyze Cranberry to suggest the optimal price.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorPriceSuggest;
