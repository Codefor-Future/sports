const config = require('../config/app-config.js');
const mysql = require('mysql');

// const pool = mysql.createPool(config.sqlCon);

const controller = class ProductsController {
    constructor() {
        // mysql connection
        this.pool = mysql.createPool(config.sqlCon);
    }

    // gey

    async addToCart(newProduct, email) {
        const connection = await new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
        });

        try {
            const productId = newProduct.id;
            const quantity = newProduct.quantity;
            const userEmail = email;

            // Check if the user exists
            const user = await new Promise((resolve, reject) => {
                connection.query('SELECT * FROM Clients WHERE adresse_courriel = ?', [userEmail], (err, connection) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(connection);
                    }
                });
            })
            if (!user || user.length === 0) {
                return { errors: [{ msg: 'User not found' }] }
            }

            // Check if the product exists
            console.log(productId)
            const product = await new Promise((resolve, reject) => {
                connection.query('SELECT * FROM produits WHERE numero_de_reference = ?', [productId], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            if (!product || product.length === 0) {
                return { errors: [{ msg: 'Product not found' }] }
            }

            // Get the user's cart, or create a new one if it doesn't exist
            let cart = await new Promise((resolve, reject) => {
                connection.query('SELECT * FROM panier WHERE adresse_courriel = ?', [userEmail], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            if (!cart || cart.length === 0) {
                await connection.query('INSERT INTO panier SET adresse_courriel = ?', [userEmail]);
                cart = await connection.query('SELECT * FROM panier WHERE adresse_courriel = ?', [userEmail]);
            }

            // Check if the product is already in the cart
            let item = await new Promise((resolve, reject) => {
                connection.query('SELECT * FROM panier_produits WHERE id_panier = ? AND numero_de_reference = ?', [cart[0].id_panier, productId], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            if (item && item.length > 0) {
                // Update the quantity of the existing item in the cart
                const updatedQuantity = item[0].quantite + quantity;
                await connection.query('UPDATE panier_produits SET quantite = ? WHERE id_panier = ? AND numero_de_reference = ?', [updatedQuantity, cart[0].id_panier, productId]);
            } else {
                // Add the product to the cart
                await connection.query('INSERT INTO panier_produits SET id_panier = ?, numero_de_reference = ?, quantite = ?', [cart[0].id_panier, productId, quantity]);
                console.log(userEmail)
                await connection.query(`UPDATE panier
                SET montant_panier = (
                  SELECT SUM(p.prix_de_vente * pp.quantite) 
                  FROM panier_produits pp 
                  JOIN produits p ON pp.numero_de_reference = p.numero_de_reference 
                  WHERE pp.id_panier = panier.id_panier
                )
                WHERE adresse_courriel = ?`, [userEmail]);
            }

            return { msg: 'Product added to cart successfully' }
        } catch (err) {
            console.error(err);
            return { errors: [{ msg: 'Server error !' }] }
        }
    }

    async getContent(email) {
        try {
            const connection = await new Promise((resolve, reject) => {
                this.pool.getConnection((err, connection) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(connection);
                    }
                });
            });
            const userEmail = email;

            const cart = await new Promise((resolve, reject) => {
                connection.query('SELECT * FROM panier WHERE adresse_courriel = ?', [userEmail], (err, connection) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(connection);
                    }
                });
            })
            console.log(cart)
            const cartItems = await new Promise((resolve, reject) => {
                connection.query(`SELECT panier.*, produits.*, panier_produits.*
                FROM panier
                JOIN panier_produits ON panier.id_panier = panier_produits.id_panier
                JOIN produits ON produits.numero_de_reference = panier_produits.numero_de_reference
                WHERE panier.adresse_courriel = ?`, [userEmail], (err, connection) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(connection);
                    }
                });
            })

            return cartItems
        } catch (error) {
            console.log(error)
        }
    }

    // update(updateProduct, user) {
    //     return new Promise(async (resolve, reject) => {

    //         try {
    //             let cartContent = await this.getContent(user);
    //             let cartProducts = JSON.parse(cartContent.content);
    //             let found = false;

    //             for (let cartProduct of cartProducts) {
    //                 if (cartProduct.id == updateProduct.id && cartProduct.size == updateProduct.size) {
    //                     found = true;
    //                     if (updateProduct.quantity > 0) {
    //                         cartProduct.quantity = updateProduct.quantity;
    //                     } else {
    //                         let index = cartProducts.indexOf(cartProduct);
    //                         cartProducts.splice(index, 1);
    //                     }
    //                 }
    //             }

    //             if (!found) cartProducts.push(updateProduct);

    //             cartProducts = JSON.stringify(cartProducts);

    //             connection.query('UPDATE `cart` SET `content` = ? WHERE `user_id` = ?', [cartProducts, user], function (err, result) {
    //                 if (err) reject(new Error('Database connection error'));
    //                 resolve('Added to the cart!');
    //             });

    //         } catch {
    //             reject(new Error('Could not access cart'))
    //         }
    //     });
    // }

    // empty(user) {
    //     return new Promise((resolve, reject) => {
    //         connection.query('DELETE FROM `cart` WHERE `user_id` ="' + user + '"', function (err, result) {
    //             if (err) {
    //                 reject(new Error('Database connection error'))
    //             } else {
    //                 resolve('Cart emptied');
    //             }
    //         });
    //     });
    // }
}

module.exports = controller;
