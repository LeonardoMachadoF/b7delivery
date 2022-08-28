import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Banner } from '../../components/Banner';
import { ProductItem } from '../../components/ProductItem';
import { SearchInput } from '../../components/SearchInput';
import { Sidebar } from '../../components/Sidebar';
import { useAppContext } from '../../contexts/app';
import { useApi } from '../../libs/useApi';
import styles from '../../styles/Home.module.css'
import { Product } from '../../types/Product';
import { Tenant } from '../../types/Tenant';

const Home = (data: Props) => {
    const { tenant, setTenant } = useAppContext();

    useEffect(() => {
        setTenant(data.tenant)
    }, [])

    const [products, setProducts] = useState<Product[]>(data.products)

    const handleSearch = (searchValue: string) => {

    }

    return (
        <div className={styles.container}>
            <Head>
                <title>{`${data.tenant.name} | Faça seu pedido`}</title>
            </Head>
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <div className={styles.headerTopLeft}>
                        <div className={styles.headerTitle}>Seja Bem-Vindo 👋</div>
                        <div className={styles.headerSubTitle}>O que deseja para hoje?</div>
                    </div>
                    <div className={styles.headerTopRight}>
                        <div className={styles.menuButton}>
                            <div className={styles.menuButtonLine} style={{ backgroundColor: tenant?.mainColor }}></div>
                            <div className={styles.menuButtonLine} style={{ backgroundColor: tenant?.mainColor }}></div>
                            <div className={styles.menuButtonLine} style={{ backgroundColor: tenant?.mainColor }}></div>
                        </div>
                        <Sidebar />
                    </div>
                </div>
                <div className={styles.headerBottom}>
                    <SearchInput onSearch={handleSearch} />
                </div>
            </header>
            <Banner />

            <div className={styles.grid}>
                {products.map((data: Product) => (
                    <ProductItem key={data.id} data={data} />
                ))}
            </div>
        </div>
    );
}

export default Home;

type Props = {
    tenant: Tenant;
    products: Product[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { tenant: tenantSlug } = context.query;
    const api = useApi(tenantSlug as string);

    const tenant = await api.getTenant();
    if (!tenant) {
        return { redirect: { destination: '/', permanent: false } }
    }

    const products = await api.getAllProducts();

    return {
        props: {
            tenant,
            products
        }
    }
}