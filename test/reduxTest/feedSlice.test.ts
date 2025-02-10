import { configureStore, Store } from '@reduxjs/toolkit';
import { FeedItem } from '../../src/models/FeedItem';
import feedReducer, { fetchFeedData, resetData } from '../../src/redux/slices/feedSlice';
import { fetchFeed } from '../../src/services/api';

jest.mock('../../src/services/api');
jest.mock("@react-native-async-storage/async-storage");
jest.mock("@react-native-community/netinfo");

describe('feedSlice', () => {
    let store: Store;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                feed: feedReducer
            }
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should handle fetchFeedData - fulfilled', async () => {
        const mockFeedData: FeedItem[] = [
            { id: 1, title: 'Title 1', description: 'Description 1', imageUrl: 'http://image1.com' },
            { id: 2, title: 'Title 2', description: 'Description 2', imageUrl: 'http://image2.com' },
        ];

        (fetchFeed as jest.Mock).mockResolvedValue(mockFeedData);

        await store.dispatch(fetchFeedData(1) as any);

        const state = store.getState().feed;

        expect(state.loading).toBe(false);
        expect(state.data).toEqual(mockFeedData);
    })

    it('should handle fetchFeedData - rejected', async () => {

        (fetchFeed as jest.Mock).mockRejectedValue(new Error('Failed to fetch data'));

        await store.dispatch(fetchFeedData(1) as any);


        const state = store.getState().feed;

        expect(state.loading).toBe(false);
        expect(state.error).toBe('Failed to fetch data');
    });

    it('should reset data', () => {

        store.dispatch(resetData());


        const state = store.getState().feed;


        expect(state.data).toEqual([]);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
    });
})