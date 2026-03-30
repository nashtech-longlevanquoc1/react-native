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
    if (!NativeProductList) {
      console.warn('[useProductList] NativeProductList module not available');
      return;
    }
    console.log('[useProductList] fetchProductList → calling getProductList()');
    setLoading(true);
    try {
      const items = await NativeProductList.getProductList();
      console.log(`[useProductList] fetchProductList ← got ${items.length} items`, items);
      setProductList(items);
    } catch (e) {
      console.error('[useProductList] fetchProductList FAILED', e);
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
      console.log(`[useProductList] addItem → id=${productId}, name=${productName}, price=${price}`);
      await NativeProductList.addToProductList(productId, productName, price, imageUrl ?? null);
      console.log(`[useProductList] addItem ← done, refreshing list`);
      await fetchProductList();
    },
    [fetchProductList]
  );

  const removeItem = useCallback(
    async (productId: string): Promise<void> => {
      if (!NativeProductList) return;
      console.log(`[useProductList] removeItem → id=${productId}`);
      await NativeProductList.removeFromProductList(productId);
      console.log(`[useProductList] removeItem ← done, refreshing list`);
      await fetchProductList();
    },
    [fetchProductList]
  );

  const checkItem = useCallback(async (productId: string): Promise<boolean> => {
    if (!NativeProductList) return false;
    console.log(`[useProductList] checkItem → id=${productId}`);
    const result = await NativeProductList.isInProductList(productId);
    console.log(`[useProductList] checkItem ← ${result} — id=${productId}`);
    return result;
  }, []);

  const clearAll = useCallback(async (): Promise<void> => {
    if (!NativeProductList) return;
    console.log('[useProductList] clearAll →');
    await NativeProductList.clearAll();
    console.log('[useProductList] clearAll ← done');
    setProductList([]);
  }, []);

  return { productList, loading, fetchProductList, addItem, removeItem, checkItem, clearAll };
}
