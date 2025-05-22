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
      <p className="mb-8 text-center text-lg">
        {user?.user_login ? `Olá, ${user.user_login}!` : "Olá, convidado!"}
      </p>

      {!user?.user_login ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex items-center gap-3">
            <label htmlFor="username" className="w-20">Usuário:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-[200px] p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <label htmlFor="password" className="w-20">Senha:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-[200px] p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-20"></div>
            <button 
              type="submit" 
              className="w-[200px] p-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Login
            </button>
          </div>
        </form>
      ) : (
        <div className="flex justify-center">
          <button 
            onClick={logout} 
            className="w-[200px] p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};