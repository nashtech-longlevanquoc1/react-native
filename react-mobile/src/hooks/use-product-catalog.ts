import { useState, useEffect } from 'react';
import NativeProductCatalog, { ProductCatalogItemJS } from '../specs/NativeProductCatalog';

export function useProductCatalog() {
  const [products, setProducts] = useState<ProductCatalogItemJS[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!NativeProductCatalog) return;
    NativeProductCatalog.getProductCatalog()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}
