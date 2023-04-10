import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";
import { AuthTokenError } from "./errors/AuthTokenError"; 
import { signOut } from "../contexts/AuthContext";

export function setupAPIClient(ctx = undefined) {
    let cookies = parseCookies(ctx);
    const api = axios.create({
        baseURL: 'http://localhost:8000',
        headers:{
            Authorization: `Bearer ${cookies['@nextauth.token']}`
        }
    });

    api
    .interceptors
    .response
    .use(response => {
        return response;
    }, (error: AxiosError) => {
        if(error.response.status === 401) {
            //deslogar.
            if(typeof window !== undefined) { // Caso seja no lado cliente.
                signOut();
            } else {
                return Promise.reject(new AuthTokenError()); // Caso seja no lado servidor.
            }
        }
        return Promise.reject(error);
    });

    return api;
}