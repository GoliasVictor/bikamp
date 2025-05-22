import { FormEventHandler, useState } from "react";
import { useAuth } from "../hooks/useAuth";
//import { useApi } from '../clientApi';

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, logout, user } = useAuth()!;
 //const api = useApi();

  const handleLogin: FormEventHandler = async (e) => {
    e.preventDefault();
    await login({
      user_login: username,
      jwtToken: "undefined"!
    });
  };

   //api.POST("/auth/login", {
    //  body: {
    //    hashSenha: password,
    //    login: username
    //  }
    //})
    //.then(async function({ data }) {
    //  await login({
    //    user_login: username,
    //    jwtToken: data?.jwtToken!
    //  });
    //})
    //.catch(function (error) {
    //  console.log(error);
    //});
    
  return (
    <div className="p-4 max-w-md mx-auto">
      <p className="mb-4 text-center text-lg">
        {user?.user_login ? `Olá, ${user.user_login}!` : "Olá, convidado!"}
      </p>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="flex items-center gap-3">
          <label htmlFor="username" className="w-20">Usuário:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <label htmlFor="password" className="w-20">Senha:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded"
          />
        </div>
        
        <div className="flex gap-2 pt-2">
          <button 
            type="submit" 
            className="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>
          
          {user?.user_login && (
            <button 
              onClick={logout} 
              className="flex-1 p-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Logout
            </button>
          )}
        </div>
      </form>
    </div>
  );
};