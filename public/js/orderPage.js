// import axios from 'axios';

// Updating active link on navbar
document.querySelector('.active').classList.remove('active');
document.querySelector('a[href="/products"]').classList.add('active');
const addToCartButton = document.getElementById('addToCartButton');

// Switch between product images
const thumbnails = document.querySelectorAll('.product-thumbnail');

for (let thumb of thumbnails) {
    thumb.addEventListener('click', (event) => {
        document.querySelector('.card-img').src = event.target.src;
    });
}

// Add product
const addButtons = document.querySelectorAll('.bi-caret-right-fill');

// for (let addBtn of addButtons) {
//     addBtn.addEventListener('click', (e) => {
//         const div = e.target.nodeName == 'path' ? e.target.parentNode.parentNode : e.target.parentNode;
//         const size = div.dataset.size;
//         const counter = document.querySelector(`#counter-${size}`);
//         const id = div.dataset.product;
//         const quantity = parseInt(counter.textContent);

//         var stockCheck = new Request(`/ajax/checkStock?size=${size}&id=${id}`, {method: 'GET'});
//         fetch(stockCheck)
//         .then(response => response.json())
//         .then(data => {
//             if(quantity + 1 <= data.stock) {
//                 counter.textContent = quantity +1;
//             } else {
//                 const popoverBtn = e.target.nodeName == 'path' ? e.target.parentNode : e.target;
//                 $(popoverBtn).popover({trigger: 'focus'}).popover('show');
//                 setTimeout(() => $(popoverBtn).popover('hide'),2200);
//             }
//         });
//     });
// }

// Remove product
const removeButtons = document.querySelectorAll('.bi-caret-left-fill');

for (let removeBtn of removeButtons) {
    removeBtn.addEventListener('click', (e) => {
        const div = e.target.nodeName == 'path' ? e.target.parentNode.parentNode : e.target.parentNode;
        const size = div.dataset.size;
        const counter = document.querySelector(`#counter-${size}`);
        const quantity = parseInt(counter.textContent);
        if (quantity > 0) counter.textContent = quantity - 1;
    });
}
addToCartButton.addEventListener('click', () => {
    const productId = addToCartButton.getAttribute('data-product-id');
    console.log(productId)
    addToCart(productId);
});

const addToCart = async (product) => {
    try {
        const addToCart = [];
        // for (let size of sizes) {
        let quantity = 1
        // }

        let res = await axios.post('/ajax/addToCart', {
            product: {
                id: product,
                quantity: quantity
            }
        })
        console.log(res)
    } catch (error) {
        console.log(error)
    }
};