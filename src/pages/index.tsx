import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { GetServerSideProps } from "next";
import styles from '../../styles/home.module.scss';
import logoImg from '../../public/logo.svg';
import { Input }  from '../components/ui/Input';
import { Button } from "../components/ui/Button";
import { AuthContext } from '../contexts/AuthContext';
import { useContext, useState, FormEvent } from 'react';
import { canSSRGuest } from "../utils/canSSRGuest";

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useContext(AuthContext);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if(email === '' || password === '') {
      alert("Por favor, preencha os dados");
      return;
    }

    setLoading(true);
    let data = { email, password };
    await signIn(data);
    //Aqui poderiamos passar o setLoading como prop para o signIn, e quando recebermos a resposta da requisição setarmos false...
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Pizzaria - Faça seu login</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="logo image"/>
        <form className={styles.login} id="form" onSubmit={handleLogin}>
          <Input
            type="email" 
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Input
            type="password" 
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}  
          />
          <Button 
            type="submit"
            loading={loading}
          >
            Acessar
          </Button>
        </form>
        <Link href="/signup" className={styles.text}>
          Não possui uma conta? Cadastre-se
        </Link>
      </div>
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (context) => {
  return {
    props: {}
  }
});

