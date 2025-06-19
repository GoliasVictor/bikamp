import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './hooks/useAuth.tsx';
import { ModalProvider } from './hooks/useModal.tsx';
import ModalView  from './components/modalView.tsx'
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <ModalView> 
            <App />
            <Toaster />
          </ModalView>
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
