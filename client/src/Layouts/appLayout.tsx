import { Outlet } from "react-router";
import "../App.css";
import ModalView from "../components/modalView";
import Menu from "@/components/menu";
export const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Navbar horizontal */}
      <header >
        <Menu/>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 flex container justify-center mx-auto p-6">
        <ModalView>
          <Outlet />
        </ModalView>
      </main>
    </div>
  );
};