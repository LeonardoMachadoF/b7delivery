import { Product } from "../../types/Product";
import { ActionType, DataType, Actions } from "./types"

export const listProductsInitial = []

export const reducer = (state: DataType, action: ActionType) => {
    switch (action.type) {
        case Actions.SET_TENANT:
            return { ...state, tenant: action.payload.tenant }
            break;
        default: return state;
    }
};