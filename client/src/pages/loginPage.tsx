import '../App.css'

import { FormEventHandler, useState } from "react";
import { useAuth } from "../hooks/useAuth";
//import { useApi } from '../clientApi';
export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, logout, user } = useAuth()!;
  //const api = useApi();
  const handleLogin : FormEventHandler = async (e) => {
    e.preventDefault();
    
    await login({
      user_login: username,
      jwtToken: "undefined"!
    });

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
    

  };
  return (
    <div>
      {user?.user_login}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <button onClick={logout}>logout</button>
    </div>
  );
};