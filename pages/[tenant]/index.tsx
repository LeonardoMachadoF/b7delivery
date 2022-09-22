import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Banner } from '../../components/Banner';
import { ProductItem } from '../../components/ProductItem';
import { SearchInput } from '../../components/SearchInput';
import { Sidebar } from '../../components/Sidebar';
import { useAppContext } from '../../contexts/app';
import { useAuthContext } from '../../contexts/auth';
import { useApi } from '../../libs/useApi';
import styles from '../../styles/Home.module.css'
import { Product } from '../../types/Product';
import { Tenant } from '../../types/Tenant';
import { User } from '../../types/User';

const Home = (data: Props) => {
    const { tenant, setTenant } = useAppContext();
    const { setToken, setUser } = useAuthContext();

    useEffect(() => {
        setTenant(data.tenant);
        setToken(data.token);
        if (data.user) setUser(data.user);
    }, [])

    const [products, setProducts] = useState<Product[]>(data.products)
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (searchValue: string) => {
        setSearchValue(searchValue);
    }
    useEffect(() => {
        let newFilteredProducts: Product[] = [];
        for (let product of data.products) {
            if (product.name.toLowerCase().indexOf(searchValue.toLocaleLowerCase()) > -1) {
                newFilteredProducts.push(product);
            }
        }
        setProducts(newFilteredProducts);
    }, [searchValue])

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
                        <div className={styles.menuButton} onClick={() => setSidebarOpen(true)}>
                            <div className={styles.menuButtonLine} style={{ backgroundColor: tenant?.mainColor }}></div>
                            <div className={styles.menuButtonLine} style={{ backgroundColor: tenant?.mainColor }}></div>
                            <div className={styles.menuButtonLine} style={{ backgroundColor: tenant?.mainColor }}></div>
                        </div>
                        <Sidebar
                            tenant={data.tenant}
                            open={sidebarOpen}
                            onClose={() => setSidebarOpen(false)}
                        />
                    </div>
                </div>
                <div className={styles.headerBottom}>
                    <SearchInput onSearch={handleSearch} />
                </div>
            </header>
            <div className={styles.mainArea}>
                {!searchValue &&
                    <>
                        <Banner />
                        <div className={styles.grid}>
                            {products.map((data: Product) => (
                                <ProductItem key={data.id} data={data} />
                            ))}
                        </div>
                    </>
                }
                {products.length > 0 &&
                    <div className={styles.grid}>
                        {products.map((item, index) => (
                            <ProductItem key={index} data={item} />
                        ))}
                    </div>
                }
                {products.length === 0 &&
                    <div className={styles.noProduct}>
                        <div className={styles.searchFor}>
                            Procurando por: <div className={styles.searched}>{searchValue}</div>
                        </div>
                        <div className={styles.plateArea}>
                            <img src='/assets/home-no-product.svg' alt="" />
                            Ops! Não há itens com este nome
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default Home;

type Props = {
    tenant: Tenant;
    products: Product[];
    user: User | null;
    token: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { tenant: tenantSlug } = context.query;
    const api = useApi(tenantSlug as string);

    const tenant = await api.getTenant();
    if (!tenant) {
        return { redirect: { destination: '/', permanent: false } }
    }

    const token = getCookie('token', context);
    const user = await api.authorizeToken(token as string);

    const products = await api.getAllProducts();

    return {
        props: {
            tenant,
            products,
            user,
            token
        }
    }
}