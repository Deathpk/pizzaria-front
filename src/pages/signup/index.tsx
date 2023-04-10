import { useState, FormEvent, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from '../../../styles/home.module.scss';
import logoImg from '../../../public/logo.svg';
import { Input }  from '../../components/ui/Input';
import { Button } from "../../components/ui/Button";
import { toast } from 'react-toastify';

export default function SignUp() {
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();
    const requiredFields = [name, email, password];

    if(requiredFields.some(field => field === '')) {
      toast.warn('Por favor, preencha todos os campos corretamente.');
      return;
    }

    setLoading(true);
    await signUp({name, email, password});
    setLoading(false);
  }
  
  return (
    <>
      <Head>
        <title>Pizzaria - Cadastre-se</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="logo image"/>
        <form className={styles.login} onSubmit={handleSignUp}>
          <h1 className={styles.title}>Criando sua conta</h1>
          <Input
              type="text" 
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)} 
            />
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
              Cadastrar
            </Button>
        </form>
        <Link href="/" className={styles.text}>
            Já possui uma conta?, faça o login!
        </Link>
      </div>
    </>
  )
}
