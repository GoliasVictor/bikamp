// src/hooks/useAuth.jsx

import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { useNavigate } from "react-router";
import { useLocalStorage } from "./useLocalStorage";
const AuthContext = createContext<AuthContextData | null>(null);
type UserData = {
	user_login: string ,
  jwtToken: string 
}
type AuthContextData = {
  user : UserData | null
  login: (data: UserData) => Promise<void>;
  logout: () => void;
}
export function AuthProvider({ children }: PropsWithChildren) {

  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (data: UserData) => {
    setUser(data);
    navigate("/login");
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};