import { Product } from "../types/Product";
import { Tenant } from "../types/Tenant";
import { User } from "../types/User";

const TEMPORARYoneProduct: Product = {
    id: 1,
    categoryName: 'Traditional',
    image: '/tmp/burger02.png',
    name: 'Texas Burguer',
    price: 25.50,
    description: '2 Blends de carne de 150g, Queijo Cheddar,Bacon Caramelizado, Salada, Molho da casa,Pão brioche artesanal'
}
export const useApi = (tenantSlug: string) => {
    return {
        getTenant: async () => {
            switch (tenantSlug) {
                case 'b7burger':
                    return {
                        slug: tenantSlug,
                        name: 'B7Burger',
                        mainColor: '#FF0000',
                        secondColor: '#00FF00'
                    }
                    break;
                case 'b7pizza':
                    return {
                        slug: tenantSlug,
                        name: 'B7Pizza',
                        mainColor: '#00FF00',
                        secondColor: '#0000FF'
                    }
                    break;
                default: return false;
            }
        },

        getAllProducts: async () => {
            let products: Product[] = [];
            for (let i = 0; i < 10; i++) {
                products.push({ ...TEMPORARYoneProduct, id: i })
            };
            return products;
        },

        getProduct: async (id: string) => {
            return TEMPORARYoneProduct;
        },

        authorizeToken: async (token: string): Promise<User | false> => {
            if (!token) {
                return false;
            }

            return {
                name: 'Leonardo',
                email: 'leo1234@gmail.com'
            }
        }

    }
}