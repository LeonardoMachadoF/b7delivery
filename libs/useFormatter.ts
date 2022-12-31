export const useFormatter = () => {
    return {
        formatPrice: (price: number) => {
            return price.toLocaleString('pt-br', {
                minimumFractionDigits: 2,
                style: 'currency',
                currency: 'BRL'
            })
        },
        formatQuantity: (qt: number, minDigits: number) => {
            if (qt.toString().length >= minDigits) return qt.toString();

            const remain = minDigits - qt.toString().length
            return `${'0'.repeat(remain)}${qt}`
        },
        formatDate: (date: String) => {
            let currentDate = new Date(`${date} 00:00:00`);
            return new Intl.DateTimeFormat('pt-BR').format(currentDate);
        }
    }
}