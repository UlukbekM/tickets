"use client"; // Ensures that this component is rendered on the client side

import { Provider } from 'react-redux';
import store from './store';

export default function ProviderWrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}
