import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import InputField from '../../../components/InputField';
import { myApi } from '../../../libs/myApi';
import styles from '../../../styles/NewAddress.module.css'
import { Address } from '../../../types/Adress';
import { Tenant } from '../../../types/Tenant';
import { User } from '../../../types/User';

const NewAddress = (data: Props) => {
    const router = useRouter();
    const api = myApi(data.tenant.slug);

    const [errorFields, setErrorFields] = useState<string[]>([]);

    const [addressCep, setAddressCep] = useState("");
    const [addressStreet, setAddressStreet] = useState("");
    const [addressNumber, setAddressNumber] = useState("");
    const [addressNeighborhood, setAddressNeighborhood] = useState("");
    const [addressCity, setAddressCity] = useState("");
    const [addressState, setAddressState] = useState("");
    const [addressComplement, setAddressComplement] = useState("");

    const verifyAddress = () => {
        const numbers = /[^0-9]/g;
        let newErrorFields: string[] = [];

        if (addressCep.replaceAll(numbers, "").length !== 8) newErrorFields.push('cep');
        if (addressStreet.length <= 2) newErrorFields.push('street');
        if (addressNeighborhood.length <= 2) newErrorFields.push('neighborhood');
        if (addressCity.length <= 2) newErrorFields.push('city');
        if (addressState.length != 2) newErrorFields.push('state');

        setErrorFields(newErrorFields);
        return newErrorFields.length === 0 ? true : false;
    }

    const handleNewAddress = async () => {
        if (!verifyAddress()) {
            let address: Address = {
                id: 0,
                cep: addressCep,
                street: addressStreet,
                city: addressCity,
                state: addressState,
                complement: addressComplement,
                neighborhood: addressNeighborhood,
                number: addressNumber
            };
            let newAddress = await api.addUserAddress(address);
            if (newAddress.id > 0) {
                router.push(`/${data.tenant.slug}/myaddresses`)
            } else {
                alert("Ocorreu algum erro, tente novamente mais tarde!")
            }
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>{`Novo Endereço | ${data.tenant.name}`}</title>
            </Head>

            <Header
                backHref={`/${data.tenant.slug}/myaddresses`}
                color={data.tenant.mainColor}
                title='Novo Endereço'
            />

            <div className={styles.inputs}>

                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>CEP</div>
                        <InputField
                            color={data.tenant.mainColor}
                            placeholder="Digite um CEP"
                            value={addressCep}
                            onChange={value => setAddressCep(value)}
                            warning={errorFields.includes('cep')}
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>Rua</div>
                        <InputField
                            color={data.tenant.mainColor}
                            placeholder="Digite uma Rua"
                            value={addressStreet}
                            onChange={value => setAddressStreet(value)}
                            warning={errorFields.includes('street')}
                        />
                    </div>
                    <div className={styles.column}>
                        <div className={styles.label}>Numero</div>
                        <InputField
                            color={data.tenant.mainColor}
                            placeholder="Digite um Número"
                            value={addressNumber}
                            onChange={value => setAddressNumber(value)}
                            warning={errorFields.includes('number')}
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>Bairro</div>
                        <InputField
                            color={data.tenant.mainColor}
                            placeholder="Digite um Bairro"
                            value={addressNeighborhood}
                            onChange={value => setAddressNeighborhood(value)}
                            warning={errorFields.includes('neighborhood')}
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.column}>

                        <div className={styles.label}>Cidade</div>
                        <InputField
                            color={data.tenant.mainColor}
                            placeholder="Digite uma Cidade"
                            value={addressCity}
                            onChange={value => setAddressCity(value)}
                            warning={errorFields.includes('city')}
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.column}>

                        <div className={styles.label}>Estado</div>
                        <InputField
                            color={data.tenant.mainColor}
                            placeholder="Digite um Estado"
                            value={addressState}
                            onChange={value => setAddressState(value)}
                            warning={errorFields.includes('state')}
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.column}>

                        <div className={styles.label}>Complemento</div>
                        <InputField
                            color={data.tenant.mainColor}
                            placeholder="Digite um Complemento"
                            value={addressComplement}
                            onChange={value => setAddressComplement(value)}
                            warning={errorFields.includes('complement')}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.btnArea}>
                <Button
                    color={data.tenant.mainColor}
                    label='Adicionar'
                    onClick={handleNewAddress}
                    fill
                />
            </div>

        </div>
    );
}

export default NewAddress;

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