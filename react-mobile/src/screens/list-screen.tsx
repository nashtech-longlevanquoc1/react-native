import React, { useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useApiData } from '../hooks/use-api-data';
import { ListItem } from '../components/ListItem';
import { useAuth } from '../contexts/auth-context';
import { Button } from '../components/Button';

export const ListScreen: React.FC = () => {
    const { apiData, loading, error } = useApiData();
    const { user, login } = useAuth();

    const handleGuestLogin = useCallback(() => {
        login('example', 'password');
    }, [login]);

    const renderItem = useCallback(
        ({ item }: { item: typeof apiData[0] }) => (
            <ListItem
                item={{
                    title: item.title,
                    body: item.albumId.toString(),
                    imageUrl: item.thumbnailUrl,
                }}
            />
        ),
        [apiData],
    );

    const keyExtractor = useCallback((item: typeof apiData[0]) => String(item.id), []);

    return (
        <View style={styles.container}>
            {user ? (
                <View style={styles.flex}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : error ? (
                        <Text>Error: {error}</Text>
                    ) : (
                        <FlatList
                            data={apiData}
                            keyExtractor={keyExtractor}
                            renderItem={renderItem}
                        />
                    )}
                </View>
            ) : (
                <>
                    <Text style={styles.guestText}>
                        Welcome Guest. Please login to view user data.
                    </Text>
                    <Button label="Login" onPress={handleGuestLogin} />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 10,
        flex: 1,
        flexDirection: 'column',
    },
    flex: {
        flex: 1,
    },
    guestText: {
        flex: 1,
    },
});


