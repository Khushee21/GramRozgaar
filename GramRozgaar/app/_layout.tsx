import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { LanguageProvider } from '@/hooks/useLanguageContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <SafeAreaProvider>
          <Slot /> {/* This renders current route like /auth/LoginRegistrationScreen */}
        </SafeAreaProvider>
      </LanguageProvider>
    </Provider>
  );
}
