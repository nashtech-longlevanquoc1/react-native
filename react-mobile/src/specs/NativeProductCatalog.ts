import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface ProductCatalogItemJS {
  id: string;
  name: string;
  category: string;
  price: number;
  salePrice: number; // 0 if not on sale
  sale: boolean;
  bg: string;
  image: string;
}

export interface Spec extends TurboModule {
  getProductCatalog(): Promise<ProductCatalogItemJS[]>;
}

export default TurboModuleRegistry.get<Spec>('ProductCatalogModule');
