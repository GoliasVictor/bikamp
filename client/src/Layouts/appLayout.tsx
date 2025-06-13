import { Outlet, NavLink } from "react-router";
import { useAuth } from "../hooks/useAuth";
import "../App.css";
import ModalView from "../components/modalView";

export const AppLayout = () => {
  const { user } = useAuth()!;
  const navLinkStyle = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100";
  const navs = [
    { to: "/bicicletas"  , title : "Bicicletas"},
    { to: "/emprestimos" , title : "Empréstimos"},
    { to: "/mantenedores", title : "Mantenedores"},
    { to: "/simulador"   , title : "Simulador Bicicletário"},
  ]
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar horizontal */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-800">BIKAMP</h1>
              
              <nav className="flex space-x-1">
              {
                navs.map(nav => (
                  <NavLink
                    to={nav.to}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${navLinkStyle}`}
                  >
                    {nav.title}
                  </NavLink>
                  )
                )
              }
              </nav>
            </div>
            
            <NavLink
              to="/login"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${navLinkStyle}`}
            >
              <span className="text-gray-500">
                {user?.user_login ? `Usuário: ${user.user_login}` : "Usuário: convidado"}
              </span>
            </NavLink>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 container mx-auto p-6">
        <ModalView>
          <Outlet />
        </ModalView>
      </main>
    </div>
  );
};