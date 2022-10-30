import { Address } from "../types/Adress";
import { CartItem } from "../types/CartItem";
import { Product } from "../types/Product";
import { User } from "../types/User";

const TEMPORARYoneProduct: Product = {
    id: 1,
    categoryName: 'Traditional',
    image: '/tmp/burger02.png',
    name: 'Texas Burguer',
    price: 25.50,
    description: '2 Blends de carne de 150g, Queijo Cheddar,Bacon Caramelizado, Salada, Molho da casa,Pão brioche artesanal'
}
export const myApi = (tenantSlug: string) => {
    return {
        getTenant: async () => {
            switch (tenantSlug) {
                case 'b7burger':
                    return {
                        slug: tenantSlug,
                        name: 'B7Burger',
                        mainColor: '#FB9400',
                        secondColor: '#FFF9F2'
                    }
                    break;
                case 'b7pizza':
                    return {
                        slug: tenantSlug,
                        name: 'B7Pizza',
                        mainColor: '#6AB70A',
                        secondColor: '#E0E0E0'
                    }
                    break;
                default: return false;
            }
        },

        getAllProducts: async () => {
            let products: Product[] = [];
            for (let i = 0; i < 10; i++) {
                products.push({ ...TEMPORARYoneProduct, id: i + 1 })
            };
            return products;
        },

        getProduct: async (id: number) => {
            return { ...TEMPORARYoneProduct, id };
        },

        authorizeToken: async (token: string): Promise<User | false> => {
            if (!token) {
                return false;
            }

            return {
                name: 'Leonardo',
                email: 'leo1234@gmail.com'
            }
        },

        getCartProducts: async (cartCookie: string) => {
            let cart: CartItem[] = [];
            if (!cartCookie) return cart;

            const cartJson = JSON.parse(cartCookie);
            for (let i in cartJson) {
                if (cartJson[i].id && cartJson[i].qt) {
                    const product = {
                        ...TEMPORARYoneProduct,
                        id: cartJson[i].id
                    }
                    cart.push({
                        qt: cartJson[i].qt,
                        product
                    })
                }
            }

            return cart;
        },

        getUserAddresses: async (email: string) => {
            const addresses: Address[] = [];

            for (let i = 0; i < 4; i++) {
                addresses.push({
                    id: i + 1,
                    street: 'Rua das Flores',
                    cep: '9999999',
                    city: 'São Paulo',
                    neighborhood: 'Jardins',
                    number: `${i}00`,
                    state: 'SP',
                    complement: 'casa'
                })
            }


            return addresses;
        }

    }
}