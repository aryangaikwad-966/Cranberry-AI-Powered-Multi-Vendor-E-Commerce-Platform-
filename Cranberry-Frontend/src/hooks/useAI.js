// AI Hooks - Aligned with Cranberry Backend API
// All AI features call the backend /api/ai/* endpoints

import { useState, useCallback } from 'react';
import { aiApi } from '../services/api';
import { sampleProducts } from '../data/sampleData';

// ============================================
// POST /api/ai/chat - Chatbot conversation
// Response: { reply, intent, suggestedProducts }
// ============================================
export const useAIChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm your AI shopping assistant. How can I help you find the perfect product today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  const sendMessage = useCallback(async (content, userId = null) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    setIsTyping(true);
    setSuggestedProducts([]);

    try {
      const response = await aiApi.chat(content, userId);

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.reply || response.response || "I understand. Let me help you with that.",
        intent: response.intent,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Set suggested products if any
      if (response.suggestedProducts) {
        setSuggestedProducts(response.suggestedProducts);
      }

      return aiMessage;
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please make sure the backend server is running.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      return errorMessage;
    } finally {
      setIsTyping(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([{
      id: 1,
      role: 'assistant',
      content: "Hello! I'm your AI shopping assistant. How can I help you find the perfect product today?",
      timestamp: new Date().toISOString()
    }]);
    setSuggestedProducts([]);
    setStreamingResponse('');
  }, []);

  return { messages, sendMessage, isTyping, streamingResponse, suggestedProducts, clearChat };
};

// ============================================
// POST /api/ai/search - Semantic search
// Response: { products, totalResults, topCategory, minPrice, maxPrice, searchInsight }
// ============================================
export const useAISearch = () => {
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);

  const search = useCallback(async (query) => {
    if (!query.trim()) {
      setResults([]);
      setAiInsights(null);
      return [];
    }

    setIsSearching(true);

    try {
      const response = await aiApi.search(query);

      const products = response.products || response.results || [];
      if (products.length > 0) {
        setResults(products);
        setAiInsights({
          query,
          totalResults: response.totalResults || products.length,
          topCategory: response.topCategory,
          minPrice: response.minPrice,
          maxPrice: response.maxPrice,
          searchInsight: response.searchInsight
        });
        return products;
      } else {
        // Fallback to sample data search
        return searchSampleData(query);
      }
    } catch (error) {
      console.error('Search error, using sample data:', error);
      // Fallback to sample data search when backend is offline
      return searchSampleData(query);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const searchSampleData = (query) => {
    const queryLower = query.toLowerCase();
    const filtered = sampleProducts.filter(p =>
      p.name.toLowerCase().includes(queryLower) ||
      p.description.toLowerCase().includes(queryLower) ||
      p.category.toLowerCase().includes(queryLower)
    );
    setResults(filtered);
    setAiInsights({
      query,
      totalResults: filtered.length,
      searchInsight: filtered.length > 0
        ? `Found ${filtered.length} products matching "${query}"`
        : 'No products found. Try different keywords.'
    });
    return filtered;
  };

  return { results, search, isSearching, aiInsights };
};

// ============================================
// POST /api/ai/recommend - Product recommendations
// Response: { products, productIds, recommendationType, reason }
// ============================================
export const useAIRecommend = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState('');

  // Get similar products (for product detail page)
  const getRecommendations = useCallback(async (productId, limit = 4) => {
    setIsLoading(true);

    try {
      const response = await aiApi.recommend({
        type: 'similar',
        productId
      });

      const products = response.products || [];
      if (products.length > 0) {
        setRecommendations(products.slice(0, limit));
        setReason(response.reason || '');
        return products.slice(0, limit);
      } else {
        // Fallback to sample data
        return getSampleRecommendations(productId, limit);
      }
    } catch (error) {
      console.error('Recommendation error, using sample data:', error);
      // Fallback to sample data when backend is offline
      return getSampleRecommendations(productId, limit);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSampleRecommendations = (productId, limit) => {
    const currentProduct = sampleProducts.find(p => p.id === parseInt(productId) || p.id === productId);
    let recommended = [];
    if (currentProduct) {
      recommended = sampleProducts
        .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
        .slice(0, limit);
    }
    if (recommended.length < limit) {
      const additional = sampleProducts
        .filter(p => p.id !== parseInt(productId) && !recommended.includes(p))
        .slice(0, limit - recommended.length);
      recommended = [...recommended, ...additional];
    }
    setRecommendations(recommended);
    setReason('Similar products you might like');
    return recommended;
  };

  // Get personalized recommendations (for logged-in users)
  const getPersonalizedRecommendations = useCallback(async (userId, limit = 6) => {
    setIsLoading(true);

    try {
      const response = await aiApi.recommend({
        type: 'personalized',
        userId
      });

      const products = response.products || [];
      if (products.length > 0) {
        setRecommendations(products.slice(0, limit));
        setReason(response.reason || '');
        return products.slice(0, limit);
      } else {
        // Fallback to sample featured products
        const featured = sampleProducts.filter(p => p.featured).slice(0, limit);
        setRecommendations(featured);
        setReason('Recommended for you');
        return featured;
      }
    } catch (error) {
      // Fallback to sample data when backend is offline
      const featured = sampleProducts.filter(p => p.featured).slice(0, limit);
      setRecommendations(featured);
      setReason('Recommended for you');
      return featured;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { recommendations, getRecommendations, getPersonalizedRecommendations, isLoading, reason };
};

// ============================================
// POST /api/ai/price-suggest - Price suggestion for vendors
// Response: { recommendedPrice, minPrice, maxPrice, confidenceScore, cranberryAnalysis, pricingInsights }
// ============================================
export const useAIPriceSuggest = () => {
  const [suggestion, setSuggestion] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getSuggestion = useCallback(async (productData) => {
    setIsAnalyzing(true);

    try {
      const response = await aiApi.priceSuggest(productData);
      setSuggestion(response);
      return response;
    } catch (error) {
      console.error('Price suggestion error:', error);
      setSuggestion(null);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearSuggestion = useCallback(() => {
    setSuggestion(null);
  }, []);

  return { suggestion, getSuggestion, clearSuggestion, isAnalyzing };
};

// ============================================
// GET /api/ai/health - AI health check
// Response: { status, model, message }
// ============================================
export const useAIHealth = () => {
  const [status, setStatus] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = useCallback(async () => {
    setIsChecking(true);

    try {
      const response = await aiApi.healthCheck();
      setStatus(response);
      return response;
    } catch (error) {
      console.error('AI health check error:', error);
      setStatus({ status: 'unhealthy', message: 'Cannot connect to AI service' });
      return { status: 'unhealthy', message: 'Cannot connect to AI service' };
    } finally {
      setIsChecking(false);
    }
  }, []);

  return { status, checkHealth, isChecking };
};
