import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './hooks/useAuth.tsx';
import { ModalProvider } from './hooks/useModal.tsx';
import ModalView from './components/modalView.tsx'
import { Toaster } from "@/components/ui/sonner"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ModalProvider>
            <ModalView>
              <App />
              <Toaster />
            </ModalView>
          </ModalProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
