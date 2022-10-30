import { getCookie, setCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Button from '../../components/Button';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import CartProductItem from '../../components/CartProductItem';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import { useAppContext } from '../../contexts/app';
import { useAuthContext } from '../../contexts/auth';
import { myApi } from '../../libs/myApi';
import { useFormatter } from '../../libs/useFormatter';
import styles from '../../styles/Checkout.module.css'
import { Address } from '../../types/Adress';
import { CartItem } from '../../types/CartItem';
import { Tenant } from '../../types/Tenant';
import { User } from '../../types/User';

const Checkout = (data: Props) => {
    const { tenant, setTenant } = useAppContext();
    const { setToken, setUser } = useAuthContext();
    const router = useRouter();
    const formatter = useFormatter();

    useEffect(() => {
        setTenant(data.tenant);
        setToken(data.token);
        if (data.user) setUser(data.user);
    }, [])



    //Product
    const [cart, setCart] = useState<CartItem[]>(data.cart);


    //Resume
    useEffect(() => {
        let sub = 0;
        for (let i in cart) {
            sub += cart[i].product.price * cart[i].qt;
        };
        setSubtotal(sub);
    }, [cart])
    const [subtotal, setSubtotal] = useState(0);
    const handleFinish = useCallback(() => {
        alert('finalizado!')
    }, [])

    //Shipping
    const [shippingPrice, setShippingPrice] = useState(0);
    const [shippingAddress, setShippingAddress] = useState<Address>();

    const handleChangeAddress = useCallback(() => {
        router.push(`/${data.tenant.slug}/myaddresses`);
        // setShippingAddress({
        //     id: 1,
        //     cep: '12247-520',
        //     street: 'Rua das Flores',
        //     number: '321',
        //     city: 'São Paulo',
        //     neighborhood: 'Jardim das Flores',
        //     state: 'SP'
        // });
        // setShippingPrice(9.5);
    }, [])

    //Payments
    const [paymentType, setPaymentType] = useState<'money' | 'card'>('money');
    const [paymentChange, setPaymentChange] = useState(0);
    const handlePaymentChange = useCallback((newValue: string) => setPaymentChange(parseInt(newValue)), []);

    //Cupom
    const [cupom, setCupom] = useState('');
    const [cupomDiscount, setCupomDiscount] = useState(0);
    const [cupomInput, setCupomInput] = useState('');
    const handleCupomChange = useCallback((newValue: string) => setCupomInput(newValue), [])
    const handleSetCupom = () => {
        if (cupomInput) {
            setCupom(cupomInput);
            setCupomDiscount(15);
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>{`Checkout | ${data.tenant.name}`}</title>
            </Head>

            <Header
                backHref={`/${data.tenant.slug}/cart`}
                color={data.tenant.mainColor}
                title='Checkout'
            />

            <div className={styles.infoGroup}>
                <div className={styles.infoArea}>
                    <div className={styles.infoTitle}>
                        Endereço
                    </div>
                    <div className={styles.infoBody}>
                        <ButtonWithIcon
                            color={data.tenant.mainColor}
                            leftIcon={'location'}
                            rightIcon={'arrowRight'}
                            value={shippingAddress ? `${shippingAddress.street} ${shippingAddress.number} - ${shippingAddress.neighborhood}` : 'Escolha um endereço'}
                            onClick={handleChangeAddress}
                        />
                    </div>
                </div>
                <div className={styles.infoArea}>
                    <div className={styles.infoTitle}>
                        Tipo de Pagamento
                    </div>
                    <div className={styles.infoBody}>
                        <div className={styles.paymentTypes}>
                            <div className={styles.paymentBtn}>
                                <ButtonWithIcon
                                    color={data.tenant.mainColor}
                                    leftIcon={'dollar'}
                                    value={'Dinheiro'}
                                    onClick={useCallback(() => setPaymentType('money'), [])}
                                    fill={paymentType === 'money'}
                                />
                            </div>
                            <div className={styles.paymentBtn}>
                                <ButtonWithIcon
                                    color={data.tenant.mainColor}
                                    leftIcon={'card'}
                                    value={'Cartão'}
                                    onClick={useCallback(() => setPaymentType('card'), [])}
                                    fill={paymentType === 'card'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {paymentType === 'money' &&
                    <div className={styles.infoArea}>
                        <div className={styles.infoTitle}>
                            Troco
                        </div>
                        <div className={styles.infoBody}>
                            <InputField
                                color={data.tenant.mainColor}
                                placeholder="Quanto você tem em dinheiro"
                                value={paymentChange ? paymentChange.toString() : ''}
                                onChange={handlePaymentChange}
                            />
                        </div>
                    </div>
                }
                <div className={styles.infoArea}>
                    <div className={styles.infoTitle}>
                        Cupom de desconto
                    </div>
                    <div className={styles.infoBody}>
                        {cupom &&
                            <ButtonWithIcon
                                color={data.tenant.mainColor}
                                leftIcon='cupom'
                                value={cupom.toUpperCase()}
                                rightIcon='confirmed'
                            />
                        }
                        {!cupom &&
                            <div className={styles.cupomInput}>
                                <InputField
                                    color={data.tenant.mainColor}
                                    placeholder='Tem um cupom?'
                                    value={cupomInput}
                                    onChange={handleCupomChange}
                                />
                                <Button
                                    color={data.tenant.mainColor}
                                    label='OK'
                                    onClick={handleSetCupom}
                                />
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div className={styles.productsQuantity}>
                {cart.length} {cart.length === 1 ? 'item' : 'itens'}
            </div>

            <div className={styles.productsList}>
                {cart.map((cartItem) => (
                    <CartProductItem
                        key={cartItem.product.id}
                        color={data.tenant.mainColor}
                        quantity={cartItem.qt}
                        product={cartItem.product}
                        noEdit
                    />
                ))}
            </div>

            <div className={styles.resumeArea}>
                <div className={styles.resumeItem}>
                    <div className={styles.resumeLeft}>Subtotal</div>
                    <div className={styles.resumeRight}>{formatter.formatPrice(subtotal)}</div>
                </div>
                {cupomDiscount > 0 &&
                    <div className={styles.resumeItem}>
                        <div className={styles.resumeLeft}>Desconto</div>
                        <div className={styles.resumeRight}>{formatter.formatPrice(-cupomDiscount)}</div>
                    </div>
                }
                <div className={styles.resumeItem}>
                    <div className={styles.resumeLeft}>Frete</div>
                    <div className={styles.resumeRight}>{shippingPrice > 0 ? formatter.formatPrice(shippingPrice) : '--'}</div>
                </div>
                <div className={styles.resumeLine}></div>
                <div className={styles.resumeItem}>
                    <div className={styles.resumeLeft}>Total</div>
                    <div className={styles.resumeRightBig} style={{ color: data.tenant.mainColor }}>{formatter.formatPrice(shippingPrice - cupomDiscount + subtotal)}</div>
                </div>
                <div className={styles.resumeButton}>
                    <Button
                        color={data.tenant.mainColor}
                        label='Finalizar Pedido'
                        onClick={handleFinish}
                        fill
                        disabled={!shippingAddress}
                    />
                </div>
            </div>
        </div>
    );
}

export default Checkout;

type Props = {
    tenant: Tenant;
    user: User | null;
    token: string;
    cart: CartItem[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { tenant: tenantSlug } = context.query;
    const api = myApi(tenantSlug as string);

    const tenant = await api.getTenant();
    if (!tenant) {
        return { redirect: { destination: '/', permanent: false } }
    }

    const token = getCookie('token', context);
    const user = await api.authorizeToken(token as string);

    const cartCookie = getCookie('cart', context);
    const cart = await api.getCartProducts(cartCookie as string);
    return {
        props: {
            tenant,
            user,
            token,
            cart
        }
    }
}