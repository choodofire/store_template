const toCurrency = price => {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(price)
}

export default toCurrency