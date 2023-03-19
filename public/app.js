import toCurrency from "./utils/toCurrency.js";
import toDate from "./utils/toDate.js";

document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent)
})

document.querySelectorAll('.price').forEach(node => {
    console.log(node.textContent)
    node.textContent = toCurrency(node.textContent)
    console.log(node.textContent)
})

const $cart = document.querySelector('#cart')
if ($cart) {
    $cart.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id
            const csrf = event.target.dataset.csrf

            fetch('/cart/remove/' + id, {
                method: 'delete',
                headers: {
                    'X-XSRF-TOKEN': csrf
                }
            }).then(res => res.json())
                .then(cart => {
                    if (cart.animals.length) {
                        const html = cart.animals.map(c => {
                            return `
                            <tr>
                                <td>${c.title}</td>
                                <td>${c.count}</td>
                                <td>
                                    <button class="btn btn-small js-remove" data-id="${c.id}" data-csrf="${csrf}">Удалить</button>
                                </td>
                            </tr>
                            `
                        }).join('')
                        $cart.querySelector('tbody').innerHTML = html
                        $cart.querySelector('.price').textContent = toCurrency(cart.price)
                    } else {
                            $cart.innerHTML = '<p>Корзина пуста</p>'
                    }
                })
        }
    })
}

const setActive = (el, active) => {
    const formField = el.parentNode.parentNode
    if (active) {
        formField.classList.add('input-field--is-active')
    } else {
        formField.classList.remove('input-field--is-active')
        el.value === '' ?
            formField.classList.remove('input-field--is-filled') :
            formField.classList.add('input-field--is-filled')
    }
}

[].forEach.call(
    document.querySelectorAll('.input-field__input, .input-field__textarea'),
    (el) => {
        el.onblur = () => {
            setActive(el, false)
        }
        el.onfocus = () => {
            setActive(el, true)
        }
    }
)