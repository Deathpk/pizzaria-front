import Head from "next/head";
import { Header } from "../../components/Header";
import { FormEvent, useState, ChangeEvent } from "react";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { FiUpload } from "react-icons/fi";
import { setupAPIClient } from "../../services/api";
import { api } from "../../services/apiClient";


type ItemProps = {
    id: string;
    name: string;
}

interface CategoryProps {
    categoryList: ItemProps[];
}

export default function Product({ categoryList }: CategoryProps) {

    const [availableCategories, setAvailableCategories] = useState(categoryList || []);
    const [categorySelected, setCategorySelected] = useState(0);
    const [avatarURL, setAvatarURL] = useState('');
    const [imageAvatar, setImageAvatar] = useState(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false); 

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const hasInvalidFields = validateRequiredFields();
        
        if(hasInvalidFields) {
            toast.warning("Preencha todos os campos e tente novamente.");
            return;
        }

        try {
            const data = new FormData();
            data.append('name', name);
            data.append('price', price);
            data.append('description', description);
            data.append('category_id', availableCategories[categorySelected].id);
            data.append('file', imageAvatar);

            await api.post('/products', data);
            toast.success('Produto cadastrado com sucesso!');
            resetFields();

        } catch(error) {
            toast.error('Ocorreu um erro ao criar um novo produto.');
            console.log(error);
        }
        
        setLoading(false);
    }

    function validateRequiredFields() {
        const requiredFields = [
            {state: imageAvatar, label: 'Avatar'},
            {state: name, label: 'Nome do produto'},
            {state: price, label: 'Preço do produto'},
            {state: description, label:'Descrição do produto'}
        ];

        return requiredFields.some(field => {return field.state === '' || field.state === null});
    }


    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if(!e.target.files) {
            return;
        }

        const image = e.target.files[0]; // como só precisamos da primeira, podemos pegar diretamente pelo index 0.

        if(!image) {
            return;
        }

        if(image.type === 'image/jpeg' || image.type === "image/png") {
            setImageAvatar(image);
            setAvatarURL(URL.createObjectURL(image));
        }
    }

    function resetFields() {
        setName('');
        setPrice('');
        setDescription('');
        setImageAvatar(null);
        setAvatarURL('');
    }

    function handleCategorySelection(event) {
        setCategorySelected(event.target.value);
    }
    
    return(
        <>
            <Head>
                <title>Novo produto - Pizzaria</title>
            </Head>

            <div>
                <Header/>
                <main className={styles.container}>
                    <h1>Novo Produto</h1>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <label className={styles.labelAvatar}>
                            <span>
                                <FiUpload
                                    size={25}
                                    color="#FFF"
                                />
                            </span>
                            <input type="file" accept="image/png, image/jpeg" onChange={handleFile} />
                            {
                                avatarURL &&
                                (
                                    <img
                                        className={styles.preview} 
                                        width={250} 
                                        height={250} 
                                        src={avatarURL} 
                                        alt="Foto do produto" 
                                    />
                                )
                            }
                        </label>

                        <select value={categorySelected} onChange={handleCategorySelection}>
                            {
                                availableCategories.map( (category, index) => {
                                    return (
                                        <option key={category.id} value={index}>
                                            {category.name}
                                        </option>
                                    )
                                })
                            }
                        </select>

                        <input 
                            placeholder="Digite o nome do produto"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                        />
                        <input
                            type="text" 
                            placeholder="Preço do produto"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className={styles.input}
                        />
                        <textarea 
                            placeholder="Descreva seu produto"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={styles.input}
                        />
                        <button type="submit" className={styles.buttonAdd}>
                            Cadastrar
                        </button>
                    </form>
                </main>
            </div>
        </>
    );    
}

export const getServerSideProps = canSSRAuth(async(context) => {
    
    const apiClient = setupAPIClient(context);
    const response = await apiClient.get('/categories');
    return {
        props: {
            categoryList: response.data.categories
        }
    }
});