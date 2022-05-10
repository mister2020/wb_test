const request = require('request')


// *****
// Глобальные переменные
// *****
let globalPaymentId = "";
let globalDeliveryPointId = "";
let globalTotalPrice = "";
let globalCharacteristicId = "";


// *****
// Куки. Нужны для авторизации аккаунта, указываются в хедере. Используется WILDAUTHNEW_V3
// *****
let cookie = "WILDAUTHNEW_V3=04F35F1B33FF7AC7AB9E64651E0CBEC73174E203527F4522DF51389CA76807740A2148B2FADF0C8BE9E72A3B9193D33D38BFE7693A40413894B557E07BECC6CF9610C45D16168A238CAE0B70F6FD04ABF697EF8D3BF839A2ADBB1DBF59CA41E5428682984BBB00BF95586841DC49629BEB73E9B45FB8B486B4C3DDC955A351614836FD33CC56632FC913F82383D1284714690C01CF633347A7757DC149EBD5F1C93F11EC8B2DD255EDB7627034571FE6C767E3C9D8FC0C6334C078A0E06084EECF8A996B3E9E5AEE442FC79308B7B7B73B835690E958F2C093619DB57CE968A6D55269EBA42711F987D802DDC3E39DF875FBC21A30DB95C1DC370653EA20C961F38B73D606AF71E7BA7E04131F1DFBA1F21CFD58311197825618BDD567E9E21DF513DB1D77322E5EF7DFB4878231F905D5790B59CB9CF416D9A98973D9C1B171DE8F51A5;"


// *****
// Добавление товара в корзину по id товара (cod1S) и id размера (characteristicId)
// *****
function addToBasket(id, sizeId){

    globalCharacteristicId = `${sizeId}`
    
    const options = {
        'method': 'POST',
        'url': 'https://www.wildberries.ru/product/addtobasket',
        'headers': {
            'Cookie': cookie
        },
        formData: {
            'cod1S': `${id}`,
            'characteristicId': `${sizeId}`,
            'quantity': '35'
        }
    }

    request(options, function (error, response) {
        if (error) throw new Error(error)
        console.log("Товар добавлен в корзину")
    });

}


// *****
// Смена адреса доставки по id адреса (Item.AddressId)
// *****
function selectPickpoint(addressId){

    globalDeliveryPointId = `${addressId}`

    const options = {
        'method': 'POST',
        'url': 'https://www.wildberries.ru/spa/poos/create?version=1',
        'headers': {
            'Cookie': cookie
        },
        formData: {
            'Item.AddressId': `${addressId}`
        }
    }

    request(options, function (error, response) {
        if (error) throw new Error(error)
        console.log("Адрес установлен")
    })

}
  

// *****
// Смена способа оплаты по его id (paymentTypeId)
// *****
function selectPayment(paymentId){

    globalPaymentId = `${paymentId}`

    const options = {
        'method': 'POST',
        'url': 'https://www.wildberries.ru/lk/basket/spa/refresh',
        'headers': {
            'Cookie': cookie
        },
        formData: {
            'paymentTypeId': `${paymentId}`
        }
    }

    request(options, function (error, response) {
        if (error) throw new Error(error)

        globalTotalPrice = `${JSON.parse(response.body).value.basket.totalPriceToPay}`

        console.log("Способ оплаты установлен")
    })

}

// *****
// Получение ссылки на оплату
// *****
function createOrder(){

    const options = {
        'method': 'POST',
        'url': 'https://www.wildberries.ru/lk/basket/spa/submitorder',
        'headers': {
            'Cookie': cookie
        },
        formData: {
            'orderDetails.DeliveryPointId': `${globalDeliveryPointId}`,
            'orderDetails.DeliveryWay': 'self',
            'orderDetails.PaymentType.Id': `${globalPaymentId}`,
            'orderDetails.AgreePublicOffert': 'true',
            'orderDetails.TotalPrice': `${globalTotalPrice}`,
            'orderDetails.UserBasketItems.Index': '0',
            'orderDetails.UserBasketItems[0].CharacteristicId': `${globalCharacteristicId}`,
            'orderDetails.IncludeInOrder[0]': `${globalCharacteristicId}`
        }
    }

    request(options, function (error, response) {
        if (error) throw new Error(error)

        createUrl = `${JSON.parse(response.body).value.url}`

        console.log("Ссылка сгенерирована")
        console.log(createUrl)
    })

    // Здесь нет return, потому что ссылку получаем выше в request (123 строка). Работать с ссылкой можно внутри request
 }
 

// *****
// Пример работы фнукций, задержка между выполнением 2 секунды
// *****
setTimeout(() => {
    addToBasket("77255847", "129396305")
}, 1000)

setTimeout(() => {
    selectPickpoint("14786")
}, 3000)

setTimeout(() => {
    selectPayment("79")
}, 5000)

setTimeout(() => {
    createOrder()
}, 7000)



