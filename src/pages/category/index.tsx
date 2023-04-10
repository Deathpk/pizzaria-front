import Head from "next/head";
import { useState, FormEvent } from "react";
import styles from "./styles.module.scss";
import { Header } from "../../components/Header";
import { Button } from "../../components/ui/Button";
import {toast} from 'react-toastify';
import { api } from "../../services/apiClient";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { FaSpinner } from "react-icons/fa";

export default function Category() {
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if(category === '') {
            toast.warn('O campo categoria deve ser preenchido.');
            return;
        }

        setLoading(true);

        try {
            await api.post('/categories', { name: category });
            toast.success('Categoria cadastrada com sucesso!');
            setCategory('');
        } catch(error) {
            const message = error.response.data.error;
            if(message === "The given category already exists.") {
                toast.error('Uma categoria com esse nome já existe.');
            } else {
                toast.error('Ocorreu um erro ao criar uma nova categoria.');
                console.log(message);
            }
        }
        
        setLoading(false);

    }

    return(
        <>
            <Head>
                <title>Nova Categoria - Pizzaria</title>
            </Head>

            <Header/>
            <main className={styles.container}>
                <form className={styles.form} onSubmit={handleSubmit} >
                    <h1>Cadastrar Categoria</h1>
                    <input
                        type="text"
                        className={styles.input} 
                        placeholder="Digite o nome para a categoria"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)} 
                    />
                    <button
                        type="submit"
                        className={styles.buttonAdd}
                    >
                        {
                             loading
                             ? (<FaSpinner color='#FFF' size={16} />) 
                             : ('Cadastrar Categoria')
                        }
                    </button>
                </form>
            </main>
        </>
    );
}

export const getServerSideProps = canSSRAuth(async (context) => {
    return {
        props: {}
    }
});