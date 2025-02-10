import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FeedItem } from "../../models/FeedItem";
import { fetchFeed } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";


interface FeedState {
    data: FeedItem[];
    loading: boolean;
    error: string | null;
    currentPage: number;
}

const initialState: FeedState = {
    data: [],
    loading: false,
    error: null,
    currentPage: 1,
};

export const fetchFeedData = createAsyncThunk('feed/fetchData', async (page: number) => {
    try {
        const netInfo = await NetInfo.fetch();

        if (!netInfo.isConnected) {
            const cachedData = await AsyncStorage.getItem('feedData');
            console.log("No Internet");
            return cachedData ? JSON.parse(cachedData) : [];
        }

        const response = await fetchFeed(page);
        await AsyncStorage.setItem('feedData', JSON.stringify(response));
        return response;
    } catch (error) {
        console.error("Error fetching feed data:", error);
        throw new Error('Failed to fetch feed data');
    }
});


const feedSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        resetData: (state) => {
            state.data = [];
            state.currentPage = 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFeedData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFeedData.fulfilled, (state, action) => {
                state.loading = false;
                const newData = action.payload;
                const uniqueData = newData.filter((item: FeedItem) =>
                    !state.data.some(existingItem => existingItem.id === item.id)
                );
                state.data = [...state.data, ...uniqueData];
            })
            .addCase(fetchFeedData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch data';
            });
    },
});

export const { resetData } = feedSlice.actions;
export default feedSlice.reducer;