import { createContext, useReducer } from 'react';
import { listProductsInitial, reducer } from './reducer';
import { ContextType, DataType, ProviderType } from './types';

export { useAppContext } from './hook';

const initialState: DataType = {
    tenant: null,
    shippingAddress: null,
    shippingPrice: 0
}

export const AppContext = createContext<ContextType>({
    state: initialState,
    dispatch: () => { }
});

export const Provider = ({ children }: ProviderType) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}





