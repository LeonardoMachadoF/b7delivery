import { memo } from 'react';
import { Icon } from '../Icon';
import styles from './styles.module.css';

type Props = {
    color: string;
    rightIcon?: string;
    leftIcon?: string;
    value: string;
    onClick?: () => void;
    fill?: boolean;
}

const ButtonWithIcon = ({ color, value, fill, leftIcon, onClick, rightIcon, }: Props) => {
    return (
        <div
            className={styles.container}
            style={{ backgroundColor: fill ? color : '#f9f9fb' }}
            onClick={onClick}
        >
            {leftIcon &&
                <div
                    className={styles.leftSide}
                    style={{ backgroundColor: fill ? 'rgba(0,0,0,0.05)' : '#fff' }}
                >
                    <Icon color={fill ? '#fff' : color} height={24} width={24} icon={leftIcon} />
                </div>
            }

            <div
                className={styles.center}
                style={{ color: fill ? '#fff' : '#1b1b1b' }}
            >
                {value}
            </div>

            {rightIcon &&
                <div className={styles.rightSide}>
                    <Icon color={color} height={24} width={24} icon={rightIcon} />
                </div>
            }


        </div>
    );
}

export default memo(ButtonWithIcon)