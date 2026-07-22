import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import type { ProductFilters } from '../types/product';

export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 60 * 1000,
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProduct(slug),
    enabled: !!slug,
    staleTime: 60 * 1000,
  });
};

export const useRelatedProducts = (slug: string) => {
  return useQuery({
    queryKey: ['related-products', slug],
    queryFn: () => productService.getRelatedProducts(slug),
    enabled: !!slug,
    staleTime: 60 * 1000,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSpeechGoals = () => {
  return useQuery({
    queryKey: ['speech-goals'],
    queryFn: () => productService.getSpeechGoals(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
