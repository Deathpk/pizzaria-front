import { createContext, ReactNode, useState, useEffect } from 'react';
import { api } from '../services/apiClient';
import Router from 'next/router';
import { destroyCookie, setCookie, parseCookies } from 'nookies'
import { toast } from 'react-toastify';

type AuthContextData = {
    user: UserProps,
    isAuthenticated: boolean,
    signUp: (credentials: SignUpProps) => Promise<void>;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
    try{
        destroyCookie(undefined, '@nextauth.token');
        Router.push('/');
    } catch(error) {
        console.log("Error ao deslogar.");
        console.log(`Message: ${error}`);
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>();
    const isAuthenticated = !!user; // convertendo para bool.
    const cookieExpirationTime = 60 * 60 * 24 * 30; // 1 Mês

    useEffect(() => {
        const { '@nextauth.token': token } = parseCookies();

        if(token) {
            api.get('/me')
            .then(response => {
                const { id, name, email } = response.data;
                setUser({ id, name, email });
            }).catch((error) => {
                signOut();
            });
        }
        
    }, []);

    async function signIn({email, password}: SignInProps) {
        try {
            const response = await api.post('/login', {
                email,
                password
            });
            const {id, name, token } = response.data;

            setCookie(undefined,'@nextauth.token', token, {
                maxAge: cookieExpirationTime,
                path: "/" // Caminhos que terão acesso ao cookie, nesse caso, o "/" é todos!
            });

            setUser({ id, name, email });
            //Passar para as proximas requisições o nosso token.
            api.defaults.headers['Authorization'] = `Bearer ${token}`;
            toast.success("Login efetuado com sucesso!");

            Router.push('/dashboard');
        } catch(error) {
            toast.error("Oops, ocorreu um erro ao logar, por favor, tente novamente.");
            console.log("Erro ao acessar", error);
        }
    }

    async function signUp({name, email, password}: SignUpProps) {
        try {
            await api.post('/register', { name, email, password});
            toast.success("Cadastro concluído com sucesso, por favor, faça o login para continuar.");
            Router.push('/');
        } catch(error) {
            toast.error("Oops, ocorreu um erro ao se cadastrar, por favor, tente novamente.");
            console.log("Erro ao cadastrar um usuário", error);
        }
    }

    return(
        <AuthContext.Provider value={{user, isAuthenticated, signUp, signIn, signOut}}>
            { children }
        </AuthContext.Provider>
    );
}