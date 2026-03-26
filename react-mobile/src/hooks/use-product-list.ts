import { useState, useCallback } from 'react';
import NativeProductList, { ProductListItemJS } from '../specs/NativeProductList';

export interface UseProductListReturn {
  productList: ProductListItemJS[];
  loading: boolean;
  fetchProductList: () => Promise<void>;
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

export function useProductList(): UseProductListReturn {
  const [productList, setProductList] = useState<ProductListItemJS[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProductList = useCallback(async (): Promise<void> => {
    if (!NativeProductList) return;
    setLoading(true);
    try {
      const items = await NativeProductList.getProductList();
      setProductList(items);
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
      if (!NativeProductList) return;
      await NativeProductList.addToProductList(productId, productName, price, imageUrl ?? null);
      await fetchProductList();
    },
    [fetchProductList]
  );

  const removeItem = useCallback(
    async (productId: string): Promise<void> => {
      if (!NativeProductList) return;
      await NativeProductList.removeFromProductList(productId);
      await fetchProductList();
    },
    [fetchProductList]
  );

  const checkItem = useCallback(async (productId: string): Promise<boolean> => {
    if (!NativeProductList) return false;
    return NativeProductList.isInProductList(productId);
  }, []);

  const clearAll = useCallback(async (): Promise<void> => {
    if (!NativeProductList) return;
    await NativeProductList.clearAll();
    setProductList([]);
  }, []);

  return { productList, loading, fetchProductList, addItem, removeItem, checkItem, clearAll };
}
