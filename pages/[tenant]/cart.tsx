import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { InputField } from '../../components/InputField';
import { useAppContext } from '../../contexts/app';
import { useAuthContext } from '../../contexts/auth';
import { useApi } from '../../libs/useApi';
import { useFormatter } from '../../libs/useFormatter';
import styles from '../../styles/Cart.module.css'
import { Product } from '../../types/Product';
import { Tenant } from '../../types/Tenant';
import { User } from '../../types/User';

const Cart = (data: Props) => {
    const { tenant, setTenant } = useAppContext();
    const { setToken, setUser } = useAuthContext();
    const formatter = useFormatter();

    useEffect(() => {
        setTenant(data.tenant);
        setToken(data.token);
        if (data.user) setUser(data.user);
    }, [])

    const [shippingInput, setShippingInput] = useState('');
    const [shippingPrice, setShippingPrice] = useState(0);
    const [subtotal, setSubtotal] = useState(0);

    const handleShippingCalc = () => { }

    const handleFinish = () => { }

    return (
        <div className={styles.container}>
            <Head>
                <title>${`Sacola | ${data.tenant.name}`}</title>
            </Head>

            <Header
                backHref={`/${data.tenant.slug}`}
                color={data.tenant.mainColor}
                title='Sacola'
            />

            <div className={styles.productsQuantity}>
                x itens
            </div>

            <div className={styles.productsList}></div>

            <div className={styles.shippingArea}>

                <div className={styles.shippingTitle}>
                    Calcular frete e prazo
                </div>

                <div className={styles.shippingForm}>
                    <InputField
                        color={data.tenant.mainColor}
                        placeholder="Digite seu frete"
                        value={shippingInput}
                        onChange={newValue => setShippingInput(newValue)}
                    />
                    <Button
                        color={data.tenant.mainColor}
                        label='OK'
                        onClick={handleShippingCalc}
                    />
                </div>

                <div className={styles.shippingInfo}>
                    <div className={styles.shippingAddress}>Rua bla bla bla</div>
                    <div className={styles.shippingTime}>
                        <div className={styles.shippingTimeText}>Receba em até 20 minutos</div>
                        <div
                            className={styles.shippingPrice}
                            style={{ color: data.tenant.mainColor }}
                        >
                            {formatter.formatPrice(shippingPrice)}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.resumeArea}>
                <div className={styles.resumeItem}>
                    <div className={styles.resumeLeft}>Subtotal</div>
                    <div className={styles.resumeRight}>{formatter.formatPrice(subtotal)}</div>
                </div>
                <div className={styles.resumeItem}>
                    <div className={styles.resumeLeft}>Frete</div>
                    <div className={styles.resumeRight}>{shippingPrice > 0 ? formatter.formatPrice(shippingPrice) : '--'}</div>
                </div>
                <div className={styles.resumeLine}></div>
                <div className={styles.resumeItem}>
                    <div className={styles.resumeLeft}>Total</div>
                    <div className={styles.resumeRightBig} style={{ color: data.tenant.mainColor }}>{formatter.formatPrice(shippingPrice + subtotal)}</div>
                </div>
                <div className={styles.resumeButton}>
                    <Button
                        color={data.tenant.mainColor}
                        label='Continuar'
                        onClick={handleFinish}
                        fill
                    />
                </div>
            </div>
        </div>
    );
}

export default Cart;

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

    const cartCookie = getCookie('cart', context);
    console.log(cartCookie)

    return {
        props: {
            tenant,
            user,
            token
        }
    }
}