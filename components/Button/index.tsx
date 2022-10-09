import { memo } from 'react';
import styles from './styles.module.css';

type Props = {
    color: string;
    label: string;
    onClick: () => void;
    fill?: boolean;
    disabled?: boolean;
}

const Button = ({ color, label, onClick, fill, disabled }: Props) => {
    return (
        <div
            className={styles.container}
            onClick={!disabled ? onClick : () => { }}
            style={{
                color: fill ? '#fff' : color,
                borderColor: color,
                backgroundColor: fill ? color : 'transparent',
                filter: disabled ? 'grayscale(100%)' : 'grayscale(0)'
            }}
        >
            {label}
        </div>
    );
}

export default memo(Button)