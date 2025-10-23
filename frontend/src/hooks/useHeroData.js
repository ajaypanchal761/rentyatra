import { useState, useEffect, useCallback, useRef } from 'react';
import apiService from '../services/api';
import { useApiPerformanceMonitor } from './usePerformanceMonitor';

/**
 * Custom hook for optimized hero section data loading
 * Implements parallel fetching, caching, and error handling
 */
export const useHeroData = () => {
  const { startApiCall, endApiCall } = useApiPerformanceMonitor();
  
  const [data, setData] = useState({
    featuredProducts: [],
    featuredListings: [],
    categories: [],
    banners: []
  });
  
  const [loading, setLoading] = useState({
    featuredProducts: true,
    featuredListings: true,
    categories: true,
    banners: true
  });
  
  const [errors, setErrors] = useState({
    featuredProducts: null,
    featuredListings: null,
    categories: null,
    banners: null
  });

  // Cache for storing fetched data
  const [cache, setCache] = useState({});
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Check if cached data is still valid
  const isCacheValid = useCallback((key) => {
    const cached = cache[key];
    if (!cached) return false;
    return Date.now() - cached.timestamp < CACHE_DURATION;
  }, [cache]);

  // Get cached data if valid
  const getCachedData = useCallback((key) => {
    if (isCacheValid(key)) {
      return cache[key].data;
    }
    return null;
  }, [cache, isCacheValid]);

  // Set cached data
  const setCachedData = useCallback((key, data) => {
    setCache(prev => ({
      ...prev,
      [key]: {
        data,
        timestamp: Date.now()
      }
    }));
  }, []);

  // Fetch featured products with caching
  const fetchFeaturedProducts = useCallback(async () => {
    const cacheKey = 'featuredProducts';
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      setData(prev => ({ ...prev, featuredProducts: cachedData }));
      setLoading(prev => ({ ...prev, featuredProducts: false }));
      return;
    }

    const callId = startApiCall('getFeaturedProducts');
    
    try {
      setLoading(prev => ({ ...prev, featuredProducts: true }));
      setErrors(prev => ({ ...prev, featuredProducts: null }));
      
      const response = await apiService.getFeaturedProducts(12);
      const products = response.data?.products || [];
      
      setData(prev => ({ ...prev, featuredProducts: products }));
      setCachedData(cacheKey, products);
      endApiCall(callId, true);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setErrors(prev => ({ ...prev, featuredProducts: error.message }));
      endApiCall(callId, false, error.message);
    } finally {
      setLoading(prev => ({ ...prev, featuredProducts: false }));
    }
  }, [getCachedData, setCachedData, startApiCall, endApiCall]);

  // Fetch featured listings with caching
  const fetchFeaturedListings = useCallback(async () => {
    const cacheKey = 'featuredListings';
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      setData(prev => ({ ...prev, featuredListings: cachedData }));
      setLoading(prev => ({ ...prev, featuredListings: false }));
      return;
    }

    try {
      setLoading(prev => ({ ...prev, featuredListings: true }));
      setErrors(prev => ({ ...prev, featuredListings: null }));
      
      const response = await apiService.getFeaturedRentalRequests(8);
      const listings = response.data?.requests || [];
      
      // Transform listings to match expected format
      const transformedListings = listings.map(request => {
        let location = 'Location not specified';
        if (request.location?.address) {
          location = request.location.address;
        } else if (request.location?.city && request.location?.state && 
                  request.location.city !== 'Unknown' && request.location.city !== 'Not specified' &&
                  request.location.city.trim() !== '' &&
                  request.location.state !== 'Unknown' && request.location.state !== 'Not specified' &&
                  request.location.state.trim() !== '') {
          location = `${request.location.city}, ${request.location.state}`;
        }
        
        return {
          id: request._id,
          title: request.title,
          description: request.description,
          price: request.price?.amount || 0,
          location: location,
          images: request.images ? (() => {
            const sortedImages = [...request.images].sort((a, b) => {
              if (a.isPrimary && !b.isPrimary) return -1;
              if (!a.isPrimary && b.isPrimary) return 1;
              return 0;
            });
            return sortedImages.map(img => img.url);
          })() : [],
          video: request.video?.url || null,
          postedDate: request.createdAt,
          category: request.category?.name || 'General',
          product: request.product?.name || 'General',
          condition: 'Good',
          owner: request.user,
          averageRating: 0,
          totalReviews: 0,
          isBoosted: false
        };
      });
      
      setData(prev => ({ ...prev, featuredListings: transformedListings }));
      setCachedData(cacheKey, transformedListings);
    } catch (error) {
      console.error('Error fetching featured listings:', error);
      setErrors(prev => ({ ...prev, featuredListings: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, featuredListings: false }));
    }
  }, [getCachedData, setCachedData]);

  // Fetch categories with caching
  const fetchCategories = useCallback(async () => {
    const cacheKey = 'categories';
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      setData(prev => ({ ...prev, categories: cachedData }));
      setLoading(prev => ({ ...prev, categories: false }));
      return;
    }

    try {
      setLoading(prev => ({ ...prev, categories: true }));
      setErrors(prev => ({ ...prev, categories: null }));
      
      const response = await apiService.getPublicCategories(1, 50);
      const categories = response.data?.categories || [];
      
      setData(prev => ({ ...prev, categories: categories }));
      setCachedData(cacheKey, categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setErrors(prev => ({ ...prev, categories: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  }, [getCachedData, setCachedData]);

  // Fetch banners with caching
  const fetchBanners = useCallback(async () => {
    const cacheKey = 'banners';
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      setData(prev => ({ ...prev, banners: cachedData }));
      setLoading(prev => ({ ...prev, banners: false }));
      return;
    }

    try {
      setLoading(prev => ({ ...prev, banners: true }));
      setErrors(prev => ({ ...prev, banners: null }));
      
      const response = await apiService.getPublicBanners('top', 5);
      const banners = response.data?.banners || [];
      
      setData(prev => ({ ...prev, banners: banners }));
      setCachedData(cacheKey, banners);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setErrors(prev => ({ ...prev, banners: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, banners: false }));
    }
  }, [getCachedData, setCachedData]);

  // Track if data has been loaded to prevent infinite loops
  const hasLoadedRef = useRef(false);

  // Load all data in parallel
  const loadAllData = useCallback(async () => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    
    console.log('🚀 Loading hero section data in parallel...');
    
    // Start all requests simultaneously
    const promises = [
      fetchFeaturedProducts(),
      fetchFeaturedListings(),
      fetchCategories(),
      fetchBanners()
    ];

    try {
      await Promise.allSettled(promises);
      console.log('✅ Hero section data loading completed');
    } catch (error) {
      console.error('❌ Error in parallel data loading:', error);
    }
  }, []);

  // Initialize data loading only once
  useEffect(() => {
    loadAllData();
  }, []); // Empty dependency array to run only once

  // Refresh specific data
  const refreshData = useCallback((type) => {
    switch (type) {
      case 'products':
        fetchFeaturedProducts();
        break;
      case 'listings':
        fetchFeaturedListings();
        break;
      case 'categories':
        fetchCategories();
        break;
      case 'banners':
        fetchBanners();
        break;
      default:
        hasLoadedRef.current = false; // Reset flag for full refresh
        loadAllData();
    }
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    setCache({});
    hasLoadedRef.current = false; // Reset loaded flag
  }, []);

  // Check if any data is still loading
  const isLoading = Object.values(loading).some(loading => loading);
  
  // Check if any errors occurred
  const hasErrors = Object.values(errors).some(error => error !== null);

  return {
    data,
    loading,
    errors,
    isLoading,
    hasErrors,
    refreshData,
    clearCache
  };
};
