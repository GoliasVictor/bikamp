import { Route, Routes } from "react-router";
import { LoginPage } from './pages/loginPage';
import BicicletasPage from './pages/bicicletasPage';
import { ProtectedLayout } from "./Layouts/protectedLayout";
import { AppLayout } from "./Layouts/appLayout";
import BicicletaPage from "./pages/bicicletaPage";
import EmprestimosPage from "./pages/emprestimosPage";
import EmprestimoPage from "./pages/emprestimoPage";


function App() {

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
          <Route path="*" element={<>not found</>} />
          <Route element={<ProtectedLayout />}>

            <Route path="bicicletas">
              <Route index element={<BicicletasPage />} />
              <Route path=":id" element={<BicicletaPage />} />
            </Route>
            <Route path="emprestimos">
              <Route index element={<EmprestimosPage />} />
              <Route path=":ra/:date" element={<EmprestimoPage />} />
            </Route>
          </Route>
          <Route path="login" element={<LoginPage />} />
      </Route>
    </Routes>
  )
}

export default App
