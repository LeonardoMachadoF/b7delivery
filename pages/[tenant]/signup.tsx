import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import { useAppContext } from '../../contexts/app';
import { myApi } from '../../libs/myApi';
import styles from '../../styles/SignUp.module.css'
import { Tenant } from '../../types/Tenant';

const SignUp = (data: Props) => {
    const { setTenant } = useAppContext();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        setTenant(data.tenant)
    }, [])

    const handleSubmit = () => { }

    return (
        <div className={styles.container}>
            <Head>
                <title>{`Cadastro | ${data.tenant.name}`}</title>
            </Head>

            <Header color={data.tenant.mainColor} backHref={`/${data.tenant.slug}/login`} />

            <div className={styles.header}>{data.tenant.name}</div>

            <div
                className={styles.subtitle}
                style={{
                    borderBottomColor: data.tenant.mainColor
                }}
            >
                Preencha os campos para criar o seu cadastro.
            </div>
            <div className={styles.line}></div>

            <div className={styles.formArea}>
                <div className={styles.inputArea}>
                    <InputField
                        color={data.tenant.mainColor}
                        placeholder="Digite seu nome"
                        value={name}
                        onChange={setName}
                    />
                </div>
                <div className={styles.inputArea}>
                    <InputField
                        color={data.tenant.mainColor}
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={setEmail}
                    />
                </div>
                <div className={styles.inputArea}>
                    <InputField
                        color={data.tenant.mainColor}
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={setPassword}
                        password
                    />
                </div>
                <div className={styles.inputArea}>
                    <Button
                        color={data.tenant.mainColor}
                        label="Cadastrar"
                        onClick={handleSubmit}
                        fill
                    />
                </div>
            </div>

            <div className={styles.forgetArea}>
                Já tem cadastro?
                <Link href={`/${data.tenant.slug}/login`}>
                    <a style={{ color: data.tenant.mainColor }}> Fazer Login</a>
                </Link>
            </div>
        </div>
    );
}

export default SignUp;

type Props = {
    tenant: Tenant
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { tenant: tenantSlug } = context.query;
    const api = myApi(tenantSlug as string);

    const tenant = await api.getTenant();

    if (!tenant) return { redirect: { destination: '/', permanent: false } };

    return {
        props: {
            tenant
        }
    }
}