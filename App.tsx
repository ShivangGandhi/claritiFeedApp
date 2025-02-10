import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import FeedScreen from './src/screen/FeedScreen';
import ErrorBoundary from './src/wrappers/ErrorBoundary';

export default function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <FeedScreen />
      </ErrorBoundary>
    </Provider>
  );
}

