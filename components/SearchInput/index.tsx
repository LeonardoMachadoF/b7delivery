import { useState } from 'react';
import styles from './styles.module.css';
import SearchIcon from './searchIcon.svg';
import { useAppContext } from '../../contexts/app';

type Props = {
    onSearch: (searchValue: string) => void;
}

export const SearchInput = ({ onSearch }: Props) => {
    const [focused, setFocused] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const { tenant, setTenant } = useAppContext();

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Enter' && searchValue !== '') {
            onSearch(searchValue);
        }
    }


    return (
        <div className={styles.container} style={{ borderColor: focused ? tenant?.mainColor : '#FFFFFF' }}>
            <div
                className={styles.button}
                onClick={() => onSearch(searchValue)}
            >
                <SearchIcon color={tenant?.mainColor} />
            </div>
            <input
                type="text"
                className={styles.input}
                placeholder="Digite o nome do produto"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyUp={handleKeyUp}
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
            />
        </div>
    )
}