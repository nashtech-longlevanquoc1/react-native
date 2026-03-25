import { FC, useState, useCallback, useEffect } from "react"
import { Button, FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import NativeCalculator from "../specs/NativeCalculator";
import NativeWishlist from "../specs/NativeWishlist";
import { useWishlist } from "../hooks/use-wishlist";

interface IDemoScreen {
    navigation: any;
}

const SAMPLE_PRODUCTS = [
    { id: 'p1', name: 'Wireless Headphones', price: 129.0 },
    { id: 'p2', name: 'Smart Watch Pro', price: 199.0 },
    { id: 'p3', name: 'Leather Tote Bag', price: 99.0 },
];

export const DemoScreen: FC<IDemoScreen> = ({ navigation }) => {
    const [addResult, setAddResult] = useState<number | null>(null);
    const [multiplyResult, setMultiplyResult] = useState<number | null>(null);
    const { wishlist, loading, fetchWishlist, addItem, removeItem, clearAll } = useWishlist();

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

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

    const isInWishlist = useCallback(
        (productId: string) => wishlist.some(i => i.productId === productId),
        [wishlist]
    );

    const handleToggleWishlist = useCallback(
        async (productId: string, productName: string, price: number) => {
            if (isInWishlist(productId)) {
                await removeItem(productId);
            } else {
                await addItem(productId, productName, price);
            }
        },
        [isInWishlist, addItem, removeItem]
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.separator} />
            <Text style={styles.sectionTitle}>TurboModule — Calculator</Text>
            {!NativeCalculator && (
                <Text style={styles.unavailable}>⚠ NativeCalculator chưa được build vào app</Text>
            )}
            <Button title="add(3, 9) — async" onPress={handleAdd} />
            {addResult !== null && <Text style={styles.result}>Result: {addResult}</Text>}
            <View style={styles.separator} />
            <Button title="multiply(4, 5) — sync" onPress={handleMultiply} />
            {multiplyResult !== null && <Text style={styles.result}>Result: {multiplyResult}</Text>}

            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Room DB — Wishlist</Text>
            {!NativeWishlist && (
                <Text style={styles.unavailable}>⚠ WishlistModule chưa được build vào app</Text>
            )}
            {SAMPLE_PRODUCTS.map(p => (
                <View key={p.id} style={styles.productRow}>
                    <View style={styles.productInfo}>
                        <Text style={styles.productName}>{p.name}</Text>
                        <Text style={styles.productPrice}>${p.price.toFixed(2)}</Text>
                    </View>
                    <Button
                        title={isInWishlist(p.id) ? '♥ Saved' : '♡ Save'}
                        onPress={() => handleToggleWishlist(p.id, p.name, p.price)}
                        color={isInWishlist(p.id) ? '#E53935' : '#00BCD4'}
                    />
                </View>
            ))}

            <View style={styles.separator} />
            <Text style={styles.sectionTitle}>
                Saved Items ({loading ? '...' : wishlist.length})
            </Text>
            {wishlist.map(item => (
                <Text key={item.productId} style={styles.wishlistItem}>
                    • {item.productName} — ${item.price.toFixed(2)}
                </Text>
            ))}
            {wishlist.length > 0 && (
                <View style={styles.separator}>
                    <Button title="Clear All" onPress={clearAll} color="#9E9E9E" />
                </View>
            )}

            <View style={styles.divider} />
            <Button
                title="Back Home"
                onPress={() => navigation.navigate('Home')}
            />
            <View style={styles.separator} />
        </ScrollView>
    );
}

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
        color: 'green',
        marginTop: 4,
    },
    unavailable: {
        fontSize: 13,
        color: '#E53935',
        marginBottom: 8,
    },
    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
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
    },
    productPrice: {
        fontSize: 13,
        color: '#757575',
    },
    wishlistItem: {
        fontSize: 14,
        paddingVertical: 4,
        color: '#424242',
    },
});