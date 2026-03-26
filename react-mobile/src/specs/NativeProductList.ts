import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface ProductListItemJS {
  id: number;
  productId: string;
  productName: string;
  price: number;
  imageUrl: string;
  createdAt: number;
}

export interface Spec extends TurboModule {
  addToProductList(
    productId: string,
    productName: string,
    price: number,
    imageUrl: string | null
  ): Promise<boolean>;
  removeFromProductList(productId: string): Promise<boolean>;
  getProductList(): Promise<ProductListItemJS[]>;
  isInProductList(productId: string): Promise<boolean>;
  clearAll(): Promise<boolean>;
}

export default TurboModuleRegistry.get<Spec>('ProductListModule');
