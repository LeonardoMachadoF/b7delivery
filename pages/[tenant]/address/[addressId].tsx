import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import InputField from '../../../components/InputField';
import { myApi } from '../../../libs/myApi';
import styles from '../../../styles/NewAddress.module.css'
import { Address } from '../../../types/Adress';
import { Tenant } from '../../../types/Tenant';
import { User } from '../../../types/User';

const EditAddress = (data: Props) => {
    const api = myApi(data.tenant.slug);

    const [errorFields, setErrorFields] = useState<string[]>([]);

    const [address, setAddress] = useState(data.address);

    const changeAddressField = async (field: keyof Address, value: typeof address[keyof Address]) => {
        setAddress({ ...address, [field]: value });
    }

    const verifyAddress = () => {
        const numbers = /[^0-9]/g;
        let newErrorFields: string[] = [];

        if (address.cep.replaceAll(numbers, "").length !== 8) newErrorFields.push('cep');
        if (address.neighborhood.length <= 2) newErrorFields.push('neighborhood');
        if (address.street.length <= 2) newErrorFields.push('street');
        if (address.state.length != 2) newErrorFields.push('state');
        if (address.city.length <= 2) newErrorFields.push('city');

        setErrorFields(newErrorFields);
        return newErrorFields.length === 0 ? true : false;
    }

    const handleSaveAddress = async () => {
        if (!verifyAddress()) {
            await api.editUserAddress(address);
        }
    }


    return (
        <div className={styles.container}>
            <Head>
                <title>{`Editar Endereço | ${data.tenant.name}`}</title>
            </Head>

            <Header
                backHref={`/${data.tenant.slug}/myaddresses`}
                color={data.tenant.mainColor}
                title='Editar Endereço'
            />

            <div className={styles.inputs}>

                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>CEP</div>
                        <InputField
                            color={data.tenant.mainColor}
                            placeholder="Digite um CEP"
                            value={address.cep}
                            onChange={value => changeAddressField('cep', value)}
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
                            value={address.street}
                            onChange={value => changeAddressField('street', value)}
                            warning={errorFields.includes('street')}
                        />
                    </div>
                    <div className={styles.column}>
                        <div className={styles.label}>Numero</div>
                        <InputField
                            color={data.tenant.mainColor}
                            placeholder="Digite um Número"
                            value={address.number}
                            onChange={value => changeAddressField('number', value)}
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
                            value={address.neighborhood}
                            onChange={value => changeAddressField('neighborhood', value)}
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
                            value={address.city}
                            onChange={value => changeAddressField('city', value)}
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
                            value={address.state}
                            onChange={value => changeAddressField('state', value)}
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
                            value={address.complement ?? ""}
                            onChange={value => changeAddressField('complement', value)}
                            warning={errorFields.includes('complement')}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.btnArea}>
                <Button
                    color={data.tenant.mainColor}
                    label='Atualizar'
                    onClick={handleSaveAddress}
                    fill
                />
            </div>

        </div>
    );
}

export default EditAddress;

type Props = {
    tenant: Tenant;
    user: User | null;
    token: string;
    address: Address;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { tenant: tenantSlug, addressId } = context.query;
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

    const address = await api.getUserAddress(parseInt(addressId as string));

    if (!address) return { redirect: { destination: "/myaddresses", permanent: false } };

    return {
        props: {
            tenant,
            user,
            token,
            address
        }
    }
}