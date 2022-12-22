import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AddressItem } from '../../components/AddressItem';
import Button from '../../components/Button';
import Header from '../../components/Header';
import { useAppContext } from '../../contexts/app';
import { useAuthContext } from '../../contexts/auth';
import { myApi } from '../../libs/myApi';
import { useFormatter } from '../../libs/useFormatter';
import styles from '../../styles/MyAddresses.module.css'
import { Address } from '../../types/Adress';
import { CartItem } from '../../types/CartItem';
import { Tenant } from '../../types/Tenant';
import { User } from '../../types/User';

const MyAddresses = (data: Props) => {
    const { tenant, setTenant } = useAppContext();
    const { setToken, setUser } = useAuthContext();
    const router = useRouter();
    const formatter = useFormatter();

    const handleNewAddress = () => {
        router.push(`/${data.tenant.slug}/newaddress`)
    }

    const handleAddressSelect = (address: Address) => { }
    const handleAddressEdit = (id: number) => { }
    const handleAddressDelete = (id: number) => { }

    const [menuOpened, setMenuOpened] = useState(0);
    const handleMenuEvent = (event: MouseEvent) => {
        const tagName = (event.target as Element).tagName;
        if (!['path', 'svg'].includes(tagName)) {
            setMenuOpened(0);
        }
    }

    useEffect(() => {
        window.removeEventListener('click', handleMenuEvent);
        window.addEventListener('click', handleMenuEvent);

        return () => window.removeEventListener('click', handleMenuEvent)
    }, [menuOpened])

    return (
        <div className={styles.container}>
            <Head>
                <title>{`Meus Endereços | ${data.tenant.name}`}</title>
            </Head>

            <Header
                backHref={`/${data.tenant.slug}/checkout`}
                color={data.tenant.mainColor}
                title='Meus Endereços'
            />

            <div className={styles.list}>
                {data.addresses.map((item) => {
                    return (
                        <AddressItem
                            key={item.id}
                            color={data.tenant.mainColor}
                            address={item}
                            onSelect={handleAddressSelect}
                            onEdit={handleAddressEdit}
                            onDelete={handleAddressDelete}
                            menuOpened={menuOpened}
                            setMenuOpened={setMenuOpened}
                        />
                    )
                })}
            </div>

            <div className={styles.btnArea}>
                <Button
                    color={data.tenant.mainColor}
                    label='Novo Endereço'
                    onClick={handleNewAddress}
                    fill
                />
            </div>

        </div>
    );
}

export default MyAddresses;

type Props = {
    tenant: Tenant;
    user: User | null;
    token: string;
    addresses: Address[];
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
    if (!user) {
        return {
            redirect: {
                destination: '/login', permanent: false
            }
        }
    }

    const addresses = await api.getUserAddresses(user.email);

    return {
        props: {
            tenant,
            user,
            token,
            addresses
        }
    }
}