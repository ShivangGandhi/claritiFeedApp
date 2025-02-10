import { View, Text, FlatList, RefreshControl, ActivityIndicator, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchFeedData, resetData } from '../redux/slices/feedSlice';
import FeedCard from '../components/FeedCard';
import { toggleTheme } from '../redux/slices/themeSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NetInfo from "@react-native-community/netinfo";
import BatteryModule, { getBatteryLevel, batteryEventEmitter } from '../native/BatteryModule';


export default function FeedScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const { data, loading, error } = useSelector((state: RootState) => state.feed);
    const { theme } = useSelector((state: RootState) => state.theme);
    const [refreshing, setRefreshing] = useState(false);
    const [isOffline, setIsOffline] = useState(false);

    const styles = useMemo(() => getFeedScreenStyles(theme), [theme]);

    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOffline(!state.isConnected);
        });

        dispatch(fetchFeedData(1));

        fetchBatteryLevel();
        startBatteryListener();

        return () => {
            BatteryModule.stopBatteryListener();
        };

        return () => unsubscribe();
    }, []);

    const fetchBatteryLevel = async () => {
        const level = await getBatteryLevel();
        setBatteryLevel(level);
    };

    const startBatteryListener = () => {
        BatteryModule.startBatteryListener();
        batteryEventEmitter.addListener('BatteryLevelChanged', (level: number) => {
            setBatteryLevel(level);
        });
    };


    const onRefresh = async () => {
        setRefreshing(true);
        try {
            dispatch(resetData());
            await dispatch(fetchFeedData(1));
        } catch (error) {
            console.error('Error during refresh:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const handleToggleTheme = () => {
        try {
            dispatch(toggleTheme());
        } catch (error) {
            console.error('Error toggling theme:', error);
        }
    };

    const handleEndReached = useCallback(() => {
        if (!loading) {
            const nextPage = Math.floor(data.length / 10) + 1;
            try {
                dispatch(fetchFeedData(nextPage));
            } catch (error) {
                console.error('Error fetching next page data:', error);
            }
        }
    }, [data, loading]);

    return (
        <SafeAreaView style={styles.container}>
            {isOffline && (
                <View style={styles.offlineBanner}>
                    <Text style={styles.offlineText}>You are offline. Showing cached data.</Text>
                </View>
            )}
            <View style={styles.header}>
                <Text style={styles.headerText}>Battery: {batteryLevel !== null ? `${batteryLevel}%` : 'Fetching...'}</Text>
            </View>

            {error && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>Error: {error}</Text>
                </View>
            )}
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <FeedCard item={item} />}
                onEndReachedThreshold={0.5}
                onEndReached={handleEndReached}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['black']}
                        tintColor="black"
                        accessibilityLabel="Pull down to refresh feed"
                    />
                }
                ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
                ListEmptyComponent={!loading && !data.length ? (
                    <View style={styles.emptyState}>
                        <Text>No data available</Text>
                    </View>
                ) : null}
            />

            <TouchableOpacity
                onPress={handleToggleTheme}
                style={styles.toggleButton}
                accessibilityLabel="Toggle theme"
                accessibilityHint="Switch between light and dark mode"
                accessibilityRole="button"
            >
                <MaterialCommunityIcons
                    name={theme === 'dark' ? 'weather-sunny' : 'weather-night'}
                    size={30}
                    style={styles.themeIcon}
                />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const getFeedScreenStyles = (theme: string) => {
    return StyleSheet.create({
        errorBanner: {
            backgroundColor: 'red',
            padding: 10,
            alignItems: 'center',
        },
        errorText: {
            color: 'white',
            fontWeight: 'bold',
        },
        emptyState: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        offlineBanner: {
            backgroundColor: 'red',
            padding: 10,
            alignItems: 'center',
        },
        offlineText: {
            color: 'white',
            fontWeight: 'bold',
        },
        header: {
            padding: 10,
            alignItems: 'center',
            backgroundColor: theme === 'dark' ? '#333' : '#f7f7f7',
        },
        headerText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme === 'dark' ? 'white' : 'black',
        },
        container: {
            flex: 1,
            backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF',
        },
        toggleButton: {
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: theme === 'dark' ? '#f39c12' : '#3498db',
            borderRadius: 30,
            padding: 15,
            elevation: 10,
        },
        themeIcon: {
            color: theme === 'dark' ? 'black' : 'white',
        }
    });
};
