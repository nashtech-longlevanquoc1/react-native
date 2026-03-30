import { useState, useEffect } from 'react';
import NativeProductCatalog, { ProductCatalogItemJS } from '../specs/NativeProductCatalog';

export function useProductCatalog() {
  const [products, setProducts] = useState<ProductCatalogItemJS[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!NativeProductCatalog) {
      console.warn('[useProductCatalog] NativeProductCatalog module not available');
      return;
    }
    console.log('[useProductCatalog] getProductCatalog → calling native');
    NativeProductCatalog.getProductCatalog()
      .then(items => {
        console.log(`[useProductCatalog] getProductCatalog ← got ${items.length} items`, items);
        setProducts(items);
      })
      .catch(e => console.error('[useProductCatalog] getProductCatalog FAILED', e))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}
