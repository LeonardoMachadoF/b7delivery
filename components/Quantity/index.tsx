import { useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useFormatter } from '../../libs/useFormatter';
import styles from './styles.module.css';

type Props = {
    color: string;
    count: number;
    onUpdateCount: (newCount: number) => void;
    min?: number;
    max?: number;
    small?: boolean;
}

export const Quantity = ({ color, count, onUpdateCount, min, max, small }: Props) => {
    const formatter = useFormatter();
    const { tenant } = useAppContext();

    const [canRemove, setCanRemove] = useState(false);
    const [canAdd, setCanAdd] = useState(false);

    useEffect(() => {
        setCanRemove((!min || (min && min < count)) ? true : false);
        setCanAdd((!max || (max && count < max)) ? true : false);
    }, [count, min, max])

    const handleRemove = () => {
        if (canRemove) onUpdateCount(count - 1);
    };

    const handleAdd = () => {
        if (canAdd) onUpdateCount(count + 1);
    };

    return (
        <div className={styles.container}>
            <div
                className={styles.button}
                onClick={handleRemove}
                style={{
                    color: canRemove ? '#fff' : '#96a3ab',
                    backgroundColor: canRemove ? color : '#f2f4f5'
                }}
            >-</div>
            <div
                className={styles.qt}
                style={{
                    fontSize: small ? '16px' : '18px',
                    width: small ? '42px' : '48px',
                    height: small ? '42px' : '48px',
                    color: tenant?.mainColor
                }}
            >
                {formatter.formatQuantity(count, 2)}
            </div>
            <div
                className={styles.button}
                onClick={handleAdd}
                style={{
                    color: canAdd ? '#fff' : '#96a3ab',
                    backgroundColor: canAdd ? color : '#f2f4f5'
                }}
            >
                +
            </div>
        </div>
    );
}