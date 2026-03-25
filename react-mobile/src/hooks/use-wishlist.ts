import { useState, useCallback } from 'react';
import NativeWishlist, { WishlistItemJS } from '../specs/NativeWishlist';

export interface UseWishlistReturn {
  wishlist: WishlistItemJS[];
  loading: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (
    productId: string,
    productName: string,
    price: number,
    imageUrl?: string
  ) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  checkItem: (productId: string) => Promise<boolean>;
  clearAll: () => Promise<void>;
}

export function useWishlist(): UseWishlistReturn {
  const [wishlist, setWishlist] = useState<WishlistItemJS[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async (): Promise<void> => {
    if (!NativeWishlist) return;
    setLoading(true);
    try {
      const items = await NativeWishlist.getWishlist();
      setWishlist(items);
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(
    async (
      productId: string,
      productName: string,
      price: number,
      imageUrl?: string
    ): Promise<void> => {
      if (!NativeWishlist) return;
      await NativeWishlist.addToWishlist(productId, productName, price, imageUrl ?? null);
      await fetchWishlist();
    },
    [fetchWishlist]
  );

  const removeItem = useCallback(
    async (productId: string): Promise<void> => {
      if (!NativeWishlist) return;
      await NativeWishlist.removeFromWishlist(productId);
      await fetchWishlist();
    },
    [fetchWishlist]
  );

  const checkItem = useCallback(async (productId: string): Promise<boolean> => {
    if (!NativeWishlist) return false;
    return NativeWishlist.isInWishlist(productId);
  }, []);

  const clearAll = useCallback(async (): Promise<void> => {
    if (!NativeWishlist) return;
    await NativeWishlist.clearAll();
    setWishlist([]);
  }, []);

  return { wishlist, loading, fetchWishlist, addItem, removeItem, checkItem, clearAll };
}
