import { Route, Routes } from "react-router";
import { LoginPage } from '@/pages/loginPage';
import BicicletasPage from '@/pages/bicicletas/bicicletasPage';
import { ProtectedLayout } from "@/Layouts/protectedLayout";
import { AppLayout } from "@/Layouts/appLayout";
import BicicletaPage from "@/pages/bicicleta/bicicletaPage";
import EmprestimosPage from "@/pages/emprestimos/emprestimosPage";
import EmprestimoPage from "@/pages/emprestimo/emprestimoPage";
import MantenedoresPage from "@/pages/mantenedores/mantenedoresPage";
import SimuladorPage from "@/pages/simulador/simuladorPage";
import BicicletariosPage from "@/pages/bicicletarios/bicicletariosPage";
import BicicletarioPage from "@/pages/bicicletario/bicicletarioPage";
import PenalidadesPage from "./pages/penalidades/penalidadesPage";


function App() {

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="*" element={<>not found</>} />
        <Route path="simulador">
          <Route index element={<SimuladorPage />} />
        </Route>
        <Route element={<ProtectedLayout />}>

          <Route path="bicicletas">
            <Route index element={<BicicletasPage />} />
            <Route path=":id" element={<BicicletaPage />} />
          </Route>
          <Route path="bicicletarios">
            <Route index element={<BicicletariosPage />} />
            <Route path=":id" element={<BicicletarioPage />} />
          </Route>

          <Route path="penalidades">
            <Route index element={<PenalidadesPage />} />
            <Route path=":id" element={<BicicletarioPage />} />
          </Route>
          <Route path="emprestimos">
            <Route index element={<EmprestimosPage />} />
            <Route path=":ra/:date" element={<EmprestimoPage />} />
          </Route>
          <Route path="mantenedores">
            <Route index element={<MantenedoresPage />} />
          </Route>
        </Route>
        <Route path="login" element={<LoginPage />} />
      </Route>
    </Routes>
  )
}

export default App
