import { useState, useEffect } from 'react';
import type { ProductSummary } from '../types/product';

const KEY = 'tt_recently_viewed';
const MAX = 8;

export const useRecentlyViewed = () => {
  const [items, setItems] = useState<ProductSummary[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // Corrupt entry — drop it so the hook recovers on next visit.
      try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    }
  }, []);

  const addProduct = (product: ProductSummary) => {
    setItems(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, MAX);
      try { localStorage.setItem(KEY, JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  };

  const clearAll = () => {
    setItems([]);
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  };

  return { items, addProduct, clearAll };
};
