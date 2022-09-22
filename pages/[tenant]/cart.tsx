import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { InputField } from '../../components/InputField';
import { useAppContext } from '../../contexts/app';
import { useAuthContext } from '../../contexts/auth';
import { useApi } from '../../libs/useApi';
import { useFormatter } from '../../libs/useFormatter';
import styles from '../../styles/Cart.module.css'
import { CartItem } from '../../types/CartItem';
import { Product } from '../../types/Product';
import { Tenant } from '../../types/Tenant';
import { User } from '../../types/User';

const Cart = (data: Props) => {
    const { tenant, setTenant } = useAppContext();
    const { setToken, setUser } = useAuthContext();
    const router = useRouter();
    const formatter = useFormatter();

    const [cart, setCart] = useState<CartItem[]>(data.cart);

    useEffect(() => {
        setTenant(data.tenant);
        setToken(data.token);
        if (data.user) setUser(data.user);
    }, [])

    //Resume
    useEffect(() => {
        let sub = 0;
        for (let i in cart) {
            sub += cart[i].product.price * cart[i].qt;
        };
        setSubtotal(sub);
    }, [cart])
    const [subtotal, setSubtotal] = useState(0);
    const handleFinish = () => {
        router.push(`/${data.tenant.slug}/checkout`)
    }

    //Product


    //Shipping
    const [shippingInput, setShippingInput] = useState('');
    const [shippingAddress, setShippingAddress] = useState('Rua bla bla');
    const [shippingPrice, setShippingPrice] = useState(0);
    const [shippingTime, setShippingTime] = useState(0);
    const handleShippingCalc = () => {
        setShippingPrice(9.5);
        setShippingTime(20);
    };



    return (
        <div className={styles.container}>
            <Head>
                <title>{`Sacola | ${data.tenant.name}`}</title>
            </Head>

            <Header
                backHref={`/${data.tenant.slug}`}
                color={data.tenant.mainColor}
                title='Sacola'
            />

            <div className={styles.productsQuantity}>
                {cart.length} {cart.length === 1 ? 'item' : 'itens'}
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

                {shippingTime > 0 &&
                    <div className={styles.shippingInfo}>
                        <div className={styles.shippingAddress}>{shippingAddress}</div>
                        <div className={styles.shippingTime}>
                            <div className={styles.shippingTimeText}>Receba em até {shippingTime} minutos</div>
                            <div
                                className={styles.shippingPrice}
                                style={{ color: data.tenant.mainColor }}
                            >
                                {formatter.formatPrice(shippingPrice)}
                            </div>
                        </div>
                    </div>
                }
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
    user: User | null;
    token: string;
    cart: CartItem[];
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
    const cart = await api.getCartProducts(cartCookie as string);
    console.log(cart)
    return {
        props: {
            tenant,
            user,
            token,
            cart
        }
    }
}