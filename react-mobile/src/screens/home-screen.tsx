import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    FlatList,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { useProductCatalog } from '../hooks/use-product-catalog';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const CATEGORIES = ['All Items', 'Electronics', 'Fashion', 'Home', 'Beauty'];

export const HomeScreen: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All Items');
    const [search, setSearch] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);
    const { products, loading } = useProductCatalog();

    const filtered = products.filter(p => {
        const matchCat = activeCategory === 'All Items' || p.category === activeCategory;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const toggleFavorite = (id: string) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const renderProduct = ({ item, index }: { item: typeof PRODUCTS[0]; index: number }) => (
        <View style={[styles.card, index % 2 === 0 ? { marginRight: 8 } : { marginLeft: 8 }]}>
            {/* Image area */}
            <View style={[styles.cardImage, { backgroundColor: item.bg }]}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.cardImageFill}
                    resizeMode="cover"
                />
                {item.sale && (
                    <View style={styles.saleBadge}>
                        <Text style={styles.saleBadgeText}>SALE</Text>
                    </View>
                )}
                <TouchableOpacity
                    style={styles.heartBtn}
                    onPress={() => toggleFavorite(item.id)}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.heartIcon, favorites.includes(item.id) && styles.heartActive]}>
                        {favorites.includes(item.id) ? '♥' : '♡'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Info */}
            <View style={styles.cardInfo}>
                <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.cardCategory}>{item.category}</Text>
                <View style={styles.cardFooter}>
                    <View style={styles.cardPriceRow}>
                        <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
                        {item.sale && item.salePrice > 0 && (
                            <Text style={styles.cardPriceOld}>${item.salePrice.toFixed(2)}</Text>
                        )}
                    </View>
                    <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
                        <Text style={styles.addBtnText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Discover</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                        <Text style={styles.iconEmoji}>🔔</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                        <Text style={styles.iconEmoji}>🛒</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search products, brands..."
                    placeholderTextColor="#BDBDBD"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Category tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
                contentContainerStyle={styles.categoryContent}
            >
                {CATEGORIES.map(cat => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.categoryTab, activeCategory === cat && styles.categoryTabActive]}
                        onPress={() => setActiveCategory(cat)}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Product grid */}
            {loading ? (
                <ActivityIndicator size="large" color="#0DF2F2" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={filtered}
                    renderItem={renderProduct}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.grid}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={styles.row}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1A1A1A',
        letterSpacing: -0.3,
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    iconEmoji: {
        fontSize: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1A1A1A',
        padding: 0,
    },
    categoryScroll: {
        flexGrow: 0,
        marginBottom: 14,
    },
    categoryContent: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    categoryTab: {
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryTabActive: {
        backgroundColor: '#0DF2F2',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    categoryTextActive: {
        fontWeight: '600',
    },
    grid: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 3,
    },
    cardImage: {
        height: 150,
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        overflow: 'hidden',
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
    },
    cardImageFill: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    saleBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#0DF2F2',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    saleBadgeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    heartBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    heartIcon: {
        fontSize: 16,
        color: '#BDBDBD',
    },
    heartActive: {
        color: '#E53935',
    },
    cardInfo: {
        padding: 10,
    },
    cardName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    cardCategory: {
        fontSize: 12,
        color: '#9E9E9E',
        marginBottom: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    cardPrice: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    cardPriceOld: {
        fontSize: 12,
        color: '#BDBDBD',
        textDecorationLine: 'line-through',
    },
    addBtn: {
        width: 30,
        height: 30,
        borderRadius: 10,
        backgroundColor: '#0DF2F2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addBtnText: {
        fontSize: 20,
        fontWeight: '300',
        lineHeight: 28,
    },
});
