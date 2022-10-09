import Image from 'next/image';
import { memo } from 'react';
import { useFormatter } from '../../libs/useFormatter';
import { Product } from '../../types/Product';
import { Quantity } from '../Quantity';
import styles from './styles.module.css';

type Props = {
    color: string;
    quantity: number;
    product: Product;
    onChange?: (newCount: number, id: number) => void;
    noEdit?: boolean;
}

const CartProductItem = ({ color, quantity, product, onChange, noEdit }: Props) => {
    const formatter = useFormatter();

    return (
        <div className={styles.container}>
            <div className={styles.productImage}>
                <Image width={85} height={80} src={product.image} alt="" />
            </div>
            <div className={styles.productInfo}>
                <div className={styles.productCategory}>
                    {product.categoryName}
                </div>
                <div className={styles.productName}>
                    {product.name}
                </div>
                <div className={styles.productPrice} style={{ color: color }}>
                    {formatter.formatPrice(product.price)}
                </div>
            </div>
            <div className={styles.qtControl}>
                {noEdit &&
                    <div className={styles.qtArea}>
                        <div className={styles.qtTitle} style={{ color: color }}>Qnt.</div>
                        <div className={styles.qtCount} style={{ color: color }}>{quantity}</div>
                    </div>
                }
                {!noEdit && onChange &&
                    <Quantity
                        color={color}
                        count={quantity}
                        onUpdateCount={(newCount: number) => onChange(newCount, product.id)}
                        min={0}
                        small
                    />
                }
            </div>
        </div>
    );
};

export default memo(CartProductItem)