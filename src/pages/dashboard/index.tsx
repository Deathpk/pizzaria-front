import { canSSRAuth } from "../../utils/canSSRAuth";
import Head from "next/head";
import { Header } from "../../components/Header";
import styles from "./styles.module.scss";
import { FiRefreshCcw } from "react-icons/fi";

export default function Dashboard() {
    return(
        <>
        <Head>
            <title>
                Painel - Pizzaria
            </title>
        </Head>
        <div>
            <Header/>
            <main className={styles.container}>
                <div className={styles.containerHeader}>
                    <h1>Últimos pedidos</h1>
                    <button>
                        <FiRefreshCcw size={25} color="#3fffa3" />
                    </button>
                </div>
                <article className={styles.listOrders}>
                    <section className={styles.orderItem}>
                        <button>
                            <span className={styles.tag}></span>
                            <span>Mesa 30</span>
                        </button>
                    </section>
                    <section className={styles.orderItem}>
                        <button>
                            <span className={styles.tag}></span>
                            <span>Mesa 20</span>
                        </button>
                    </section>
                </article>
            </main>
        </div>
        </>
    );
}

export const getServerSideProps = canSSRAuth(async (context) => {
    return {
        props: {}
    }
});