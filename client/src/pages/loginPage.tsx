import { FormEventHandler, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import MantenedorComboBox from "@/components/mantenedorComboBox";
//import { useApi } from '../clientApi';
import { useQuery } from '@tanstack/react-query';
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";

export const LoginPage = () => {
  const [mantenedorId, setMantenedorId] = useState<number| null>(null);
  const { login, logout, user } = useAuth()!;
  //const api = useApi();
  const client = useApi();
  const { data , isLoading} = useQuery({
    queryKey: ["mantenedores"],
    queryFn: async () => {
      return (await client.GET("/mantenedores")).data
    },
  });
  const handleLogin: FormEventHandler = async (e) => {
    e.preventDefault();
    if (!mantenedorId) {
      toast.error("Por favor, selecione um mantenedor.");
      return;
    }
    await login({
      user_login: data?.find(t => t.mantenedor_id == mantenedorId)?.nome || "Convidado",
      jwtToken: "undefined"!,
      mantenedor_id: mantenedorId
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
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-4 max-w-md mx-auto">
      <p className="mb-8 text-center text-lg">
        {user?.user_login ? `Olá, ${user.user_login}!` : "Olá, convidado!"}
      </p>

      {!user?.user_login ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Login
            </CardTitle>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
          <div className="grid gap-4 my-4">
            <div className="grid gap-3">
              <Label htmlFor="username">Usuário:</Label>
              <MantenedorComboBox
                value={mantenedorId}
                onChange={setMantenedorId}
              />
            </div>
          </div>
   
          
          <div className="flex items-center justify-end gap-3">
            <Button type="submit" >
              Login
            </Button>
          </div>
          </form>
        
          </CardContent>
        </Card>
          
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