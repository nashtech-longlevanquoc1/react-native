import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import NativeCalculator from '../specs/NativeCalculator';
import NativeProductList from '../specs/NativeProductList';
import { useProductList } from '../hooks/use-product-list';
import { useProductCatalog } from '../hooks/use-product-catalog';
import type { ProductCatalogItemJS } from '../specs/NativeProductCatalog';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../types/navigation';

type DemoScreenProps = BottomTabScreenProps<MainTabParamList, 'Demo'>;

export const DemoScreen: FC<DemoScreenProps> = ({ navigation }) => {
  const [addResult, setAddResult] = useState<number | null>(null);
  const [multiplyResult, setMultiplyResult] = useState<number | null>(null);
  const { productList, loading, fetchProductList, addItem, removeItem, clearAll } =
    useProductList();
  const { products: catalogProducts, loading: catalogLoading } = useProductCatalog();

  useEffect(() => {
    fetchProductList();
  }, [fetchProductList]);

  const handleAdd = useCallback(async () => {
    if (!NativeCalculator) return;
    const result = await NativeCalculator.add(3, 9);
    setAddResult(result);
  }, []);

  const handleMultiply = useCallback(() => {
    if (!NativeCalculator) return;
    const result = NativeCalculator.multiply(4, 5);
    setMultiplyResult(result);
  }, []);

  const isInProductList = useCallback(
    (productId: string) => productList.some((i) => i.productId === productId),
    [productList],
  );

  const handleToggleProductList = useCallback(
    async (product: ProductCatalogItemJS) => {
      if (isInProductList(product.id)) {
        await removeItem(product.id);
      } else {
        await addItem(product.id, product.name, product.price);
      }
    },
    [isInProductList, addItem, removeItem],
  );

  const handleBackHome = useCallback(() => {
    navigation.navigate('Shop');
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.separator} />

      {/* ── Calculator ── */}
      <Text style={styles.sectionTitle}>TurboModule — Calculator</Text>
      {!NativeCalculator && (
        <Text style={styles.unavailable}>⚠ NativeCalculator not available</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>add(3, 9) — async</Text>
      </TouchableOpacity>
      {addResult !== null && (
        <Text style={styles.result}>Result: {addResult}</Text>
      )}
      <View style={styles.separator} />
      <TouchableOpacity style={styles.button} onPress={handleMultiply}>
        <Text style={styles.buttonText}>multiply(4, 5) — sync</Text>
      </TouchableOpacity>
      {multiplyResult !== null && (
        <Text style={styles.result}>Result: {multiplyResult}</Text>
      )}

      <View style={styles.divider} />

      {/* ── Product List ── */}
      <Text style={styles.sectionTitle}>Room DB — Product List</Text>
      {!NativeProductList && (
        <Text style={styles.unavailable}>⚠ ProductListModule not available</Text>
      )}
      {catalogLoading && (
        <Text style={styles.unavailable}>Loading catalog…</Text>
      )}
      {catalogProducts.map((p) => {
        const saved = isInProductList(p.id);
        return (
          <View key={p.id} style={styles.productRow}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{p.name}</Text>
              <Text style={styles.productPrice}>${p.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={[styles.saveButton, saved && styles.saveButtonSaved]}
              onPress={() => handleToggleProductList(p)}
            >
              <Text style={styles.saveButtonText}>
                {saved ? '♥ Saved' : '♡ Save'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <View style={styles.separator} />
      <Text style={styles.sectionTitle}>
        Saved Items ({loading ? '…' : productList.length})
      </Text>
      {productList.map((item) => (
        <Text key={item.productId} style={styles.savedItem}>
          • {item.productName} — ${item.price.toFixed(2)}
        </Text>
      ))}
      {productList.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      )}

      <View style={styles.divider} />
      <TouchableOpacity style={styles.button} onPress={handleBackHome}>
        <Text style={styles.buttonText}>← Back Home</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  separator: {
    height: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  result: {
    fontSize: 16,
    color: '#2E7D32',
    marginTop: 4,
  },
  unavailable: {
    fontSize: 13,
    color: '#E53935',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#00BCD4',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginVertical: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  productInfo: {
    flex: 1,
    marginRight: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
  },
  productPrice: {
    fontSize: 13,
    color: '#757575',
    marginTop: 2,
  },
  saveButton: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#00BCD4',
  },
  saveButtonSaved: {
    backgroundColor: '#E53935',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  savedItem: {
    fontSize: 14,
    paddingVertical: 4,
    color: '#424242',
  },
  clearButton: {
    marginTop: 8,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#9E9E9E',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});