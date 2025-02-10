# Feed App

## Setup Instructions

1. **Clone the Repository:**

   ```sh
   git clone https://github.com/ShivangGandhi/claritiFeedApp.git
   cd claritiFeedApp/
   ```

2. **Install Dependencies:**

   ```sh
   npm install
   ```

3. **Start the Application:**

   For ios:
   ```sh
   npx expo run:ios
   ```
   
   For android:
   ```sh
   npx expo run:android 
   ```

3. **If want to run on Expo Go:**

   ```sh
   npx expo start
   ```


## Performance Optimization Strategies Used

1. **Memoization with **``** and **``**:**

   - Used `useMemo` to optimize style calculations based on theme changes.
   - Used `useCallback` to prevent unnecessary function re-creations in `FlatList`.

2. **Efficient Redux State Management:**

   - Used `useSelector` to select specific slices of the state to prevent unnecessary re-renders.
   - Used Redux Toolkit for better performance and maintainability.

3. **Lazy Loading & Image Optimization:**

   - Integrated `react-native-fast-image` for optimized image rendering and caching.
   - Used an `ActivityIndicator` to show loading state while images are being fetched.

4. **Asynchronous Data Fetching & Caching:**

   - Implemented API calls using Redux `createAsyncThunk`.
   - Showed cached data when offline using `@react-native-community/netinfo`.

5. **Error Handling & Resilience:**

   - Used an `ErrorBoundary` component to catch runtime errors and prevent crashes.
   - Implemented graceful fallback UI when errors occur.

6. **Battery Optimization:**

   - Used native battery monitoring via `BatteryModule` to reduce unnecessary updates.
   - Started and stopped battery listeners efficiently to avoid memory leaks.

## Assumptions & Trade-offs

1. **Offline Mode Handling:**

   - Assumed users might be offline frequently, so an offline banner is displayed when connectivity is lost.
   - Cached data is displayed instead of fetching new data.

2. **List Pagination Strategy:**

   - Used `onEndReached` in `FlatList` to fetch new data as users scroll.
   - Assumed 10 items per page; can be adjusted based on backend API response.

3. **Theme Toggle Implementation:**

   - Theme state is managed via Redux, allowing dynamic switching between dark and light modes.
   - Chose not to persist theme preferences for simplicity but could be extended using AsyncStorage.

4. **Battery Monitoring & UI Updates:**

   - The battery level updates dynamically in the UI, assuming users may need this info.
   - However, this could introduce additional overhead, so updates are throttled appropriately.

## Future Improvements

1. **Persist Theme Preferences:**

   - Save user-selected theme mode to AsyncStorage for persistence across app sessions.

2. **Enhanced Offline Mode:**

   - Implement SQLite, MMKV storage, etc to allow more robust offline data storage and retrieval.

3. **Error Reporting & Logging:**

   - Integrate a service like Sentry for better error tracking and debugging in production.