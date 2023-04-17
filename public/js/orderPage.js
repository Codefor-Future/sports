// import axios from 'axios';

// Updating active link on navbar
document.querySelector('.active').classList.remove('active');
document.querySelector('a[href="/products"]').classList.add('active');
const addToCartButton = document.getElementById('addToCartButton');
const addToWishButton = document.getElementById('addToWishList');
const addReviewButton = document.getElementById('addReviewButton');
const star1 = document.getElementById('startRatingStars1');
const star2 = document.getElementById('startRatingStars2');
const star3 = document.getElementById('startRatingStars3');
const star4 = document.getElementById('startRatingStars4');
const star5 = document.getElementById('startRatingStars5');
const ratingValue = document.getElementById('ratingValue');
let rating = 0
ratingValue.innerHTML = 0


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
star1.addEventListener('click', () => {
    ratingValue.innerHTML = 1
    rating =1
});
star2.addEventListener('click', () => {
    ratingValue.innerHTML = 2
    rating =2
});
star3.addEventListener('click', () => {
    ratingValue.innerHTML = 3
    rating =3
});
star4.addEventListener('click', () => {
    ratingValue.innerHTML = 4
    rating =4
});
star5.addEventListener('click', () => {
    ratingValue.innerHTML = 5
    rating =5
});
addToCartButton.addEventListener('click', () => {
    const productId = addToCartButton.getAttribute('data-product-id');
    console.log(productId)
    addToCart(productId);
});
addReviewButton.addEventListener('click', () => {
    const productId = addToCartButton.getAttribute('data-product-id');
    console.log(productId)
    const review = document.getElementById('Review').value
    addReview(productId, review);
});
addToWishButton.addEventListener('click', () => {
    const productId = addToWishButton.getAttribute('data-product-id');
    console.log(productId)
    addToWishList(productId);
});
const addReview = async (product, comment) => {
    console.log(comment)
    try {
        let res = await axios.post('/ajax/addReview', {
            product,
            review: {
                note:5,
                comment 
            }
        })
        console.log(res)
    } catch (error) {
        console.log(error)
    }
};
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
const addToWishList = async (product) => {
    try {
        const addToCart = [];
        // for (let size of sizes) {
        let quantity = 1
        // }

        let res = await axios.post('/ajax/addToWishList', {
            product
        })
        console.log(res)
    } catch (error) {
        console.log(error)
    }
};