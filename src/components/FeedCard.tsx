import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useState, useMemo, useRef } from 'react';
import Animated, { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import FastImage from 'react-native-fast-image';

interface FeedCardProps {
    item: {
        id: number;
        title: string;
        description: string;
        imageUrl: string;
    };
}

export default function FeedCard({ item }: FeedCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(true);
    const { theme } = useSelector((state: RootState) => state.theme);

    const height = useSharedValue(0);
    const opacity = useSharedValue(0);
    const descHeightRef = useRef(0);

    const toggleExpand = () => {
        const isExpanding = !expanded;
        height.value = withTiming(isExpanding ? descHeightRef.current : 0, { duration: 200 });
        opacity.value = withTiming(isExpanding ? 1 : 0, { duration: 200 });
        setExpanded(isExpanding);
    };

    const styles = useMemo(() => getFeedCardStyles(theme), [theme]);

    return (
        <TouchableOpacity
            onPress={toggleExpand}
            activeOpacity={0.8}
            accessibilityLabel={`Post titled ${item.title}`}
            accessibilityHint="Double tap to expand description"
            accessibilityRole="button"
        >
            <View style={styles.card}>
                <View style={styles.imageContainer}>
                    {loading && <ActivityIndicator size="small" style={styles.loader} />}
                    <FastImage
                        source={{ uri: item.imageUrl }}
                        style={styles.image}
                        resizeMode={FastImage.resizeMode.cover}
                        onLoadEnd={() => setLoading(false)}
                        onError={() => {
                            console.log("FastImage failed to load.");
                            setLoading(false);
                        }}
                        fallback={true}
                        accessibilityLabel="Image representing post"
                    />
                </View>

                <Text style={styles.title}>{item.title}</Text>

                <View
                    style={styles.measureContainer}
                    onLayout={(event) => {
                        if (!descHeightRef.current) {
                            descHeightRef.current = event.nativeEvent.layout.height;
                        }
                    }}
                >
                    <Text style={styles.description}>{item.description}</Text>
                </View>

                <Animated.View style={[styles.animatedContainer, { height, opacity }]}>
                    <Text style={styles.description}>{item.description}</Text>
                </Animated.View>
            </View>
        </TouchableOpacity>
    );
}

const getFeedCardStyles = (theme: string) => {
    return StyleSheet.create({
        card: {
            margin: 10,
            padding: 10,
            borderRadius: 8,
            backgroundColor: theme === 'dark' ? '#1E1E1E' : 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
        },
        imageContainer: {
            position: 'relative',
            width: '100%',
            height: 150,
            borderRadius: 8,
            overflow: 'hidden',
        },
        loader: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: [{ translateX: -10 }, { translateY: -10 }],
            color: theme === 'dark' ? 'white' : 'black'
        },
        image: {
            width: '100%',
            height: '100%',
            borderRadius: 8,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            marginTop: 10,
            color: theme === 'dark' ? 'white' : 'black',
        },
        animatedContainer: {
            overflow: 'hidden',
        },
        description: {
            fontSize: 14,
            color: theme === 'dark' ? 'lightgray' : 'gray',
            marginTop: 5,
        },
        measureContainer: {
            position: 'absolute',
            opacity: 0,
            zIndex: -1,
        }
    });
};
