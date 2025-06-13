import createClient, { Middleware } from "openapi-fetch";
import type { paths } from "./lib/api/lastest"; 
import { useAuth } from "./hooks/useAuth";

export function useApi() {
	const client = createClient<paths>({ baseUrl: import.meta.env.VITE_API_URL })

	const { user } = useAuth()!
	if (user) {
		const accessToken = user.jwtToken
		const authMiddleware: Middleware = {
		  async onRequest({ request }) {
			request.headers.set("Authorization", `Bearer ${accessToken}`);
			return request;
		  },
		};
		client.use(authMiddleware);	
	}
	
	return client;
} 