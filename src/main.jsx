import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from 'react-hot-toast'
import { store, persistor } from './store/index.js'
import { SiteConfigProvider } from './context/SiteConfigContext.jsx'
import { GameProvider } from './context/GameContext.jsx'
import './i18n'
import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000, retry: 2 },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <SiteConfigProvider>
              <GameProvider>
                <App />
                <Toaster position="top-center" />
              </GameProvider>
            </SiteConfigProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </PersistGate>
    </ReduxProvider>
  </StrictMode>,
)
