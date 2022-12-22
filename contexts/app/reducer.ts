import { Product } from "../../types/Product";
import { ActionType, DataType, Actions } from "./types"

export const listProductsInitial = []

export const reducer = (state: DataType, action: ActionType) => {
    switch (action.type) {
        case Actions.SET_TENANT:
            return { ...state, tenant: action.payload.tenant }
        case Actions.SET_SHIPPING_ADDRESS:
            return { ...state, shippingAddress: action.payload.shippingAddress }
        case Actions.SET_SHIPPING_PRICE:
            return { ...state, shippingPrice: action.payload.shippingPrice }
        default: return state;
    }
};