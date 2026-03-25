import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface WishlistItemJS {
  id: number;
  productId: string;
  productName: string;
  price: number;
  imageUrl: string;
  createdAt: number;
}

export interface Spec extends TurboModule {
  addToWishlist(
    productId: string,
    productName: string,
    price: number,
    imageUrl: string | null
  ): Promise<boolean>;
  removeFromWishlist(productId: string): Promise<boolean>;
  getWishlist(): Promise<WishlistItemJS[]>;
  isInWishlist(productId: string): Promise<boolean>;
  clearAll(): Promise<boolean>;
}

export default TurboModuleRegistry.get<Spec>('WishlistModule');
