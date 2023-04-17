const config = require('../config/app-config.js');
const mysql = require('mysql');

// const pool = mysql.createPool(config.sqlCon);

const controller = class ProductsController {
    constructor() {
        // mysql connection
        this.pool = mysql.createPool(config.sqlCon);
    }
    async createOrder(values, email) {
        const connection = await new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
        });

        try {// Get product ID and user email from request body
            const userEmail = email;

            // fetch card id
            const cart = await new Promise((resolve, reject) => {
                connection.query('SELECT * FROM panier WHERE adresse_courriel = ?', [userEmail], (err, connection) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(connection);
                    }
                });
            })

            // insert to commande 
            const add = await new Promise((resolve, reject) => {
                connection.query('INSERT INTO commande (montant_total, statut_payement, methode_payement, id_panier, date_de_commande, statut_de_livraison, accompli) VALUES (?,?,?,?,?,?,?)', [values.total, values.paymentStatus, values.paymentMethod, cart[0].id_panier, new Date(values.date).toISOString().slice(0, 10),values.deliveryStatus ,userEmail], (err, connection) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(connection);
                    }
                });
            })

            return { msg: 'Review added to wishlist successfully', review: add }
        } catch (err) {
            console.error(err);
            return { errors: [{ msg: 'Server error !' }] }
        }
    }
    async getOrders(email) {
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

            const items = await new Promise((resolve, reject) => {
                connection.query(`
                SELECT * FROM commande
                WHERE accompli = ?
              `, [userEmail], (err, connection) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(connection);
                    }
                });
            })

            return items
        } catch (error) {
            console.log(error)
        }
    }

    async addReview(id, email, review) {
        console.log(review)
        const connection = await new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
        });

        try {// Get product ID and user email from request body
            const productId = id;
            const userEmail = email;

            // Add product to wishlist
            const add = await new Promise((resolve, reject) => {
                connection.query('INSERT INTO Reviews (note, numero_de_reference, commentaire, donne) VALUES (?, ?, ?, ?)', [review.note, productId, review.comment, userEmail], (err, connection) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(connection);
                    }
                });
            })

            // Send success response

            return { msg: 'Review added to wishlist successfully', review: add }
        } catch (err) {
            console.error(err);
            return { errors: [{ msg: 'Server error !' }] }
        }
    }

    async addToWishList(id, email) {
        const connection = await new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
        });

        try {// Get product ID and user email from request body
            const productId = id;
            const userEmail = email;

            // Check if user exists
            const users = await new Promise((resolve, reject) => {
                connection.query('SELECT * FROM Clients WHERE adresse_courriel = ?', [userEmail], (err, connection) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(connection);
                    }
                });
            })
            if (users.length === 0) {
                return { error: 'User not found' }
            }

            // Check if product exists
            const products = await new Promise((resolve, reject) => {
                connection.query('SELECT * FROM produits WHERE numero_de_reference = ?', [productId], (err, connection) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(connection);
                    }
                });
            })
            if (products.length === 0) {
                return { error: 'Product not found' }
            }

            // Check if product is already in user's wishlist
            const wishlist = await new Promise((resolve, reject) => {
                connection.query('SELECT * FROM wish_list WHERE adresse_courriel = ? AND numero_de_reference = ?', [userEmail, productId], (err, connection) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(connection);
                    }
                });
            })
            if (wishlist.length > 0) {
                return { error: 'Product already in wishlist' }
            }

            // Add product to wishlist
            const add = await new Promise((resolve, reject) => {
                connection.query('INSERT INTO wish_list (adresse_courriel, numero_de_reference) VALUES (?, ?)', [userEmail, productId], (err, connection) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(connection);
                    }
                });
            })

            // Send success response

            return { msg: 'Product added to wishlist successfully' }
        } catch (err) {
            console.error(err);
            return { errors: [{ msg: 'Server error !' }] }
        }
    }
    async getWishListed(email) {
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

            const items = await new Promise((resolve, reject) => {
                connection.query(`
                SELECT produits.*
                FROM wish_list
                INNER JOIN produits ON produits.numero_de_reference = wish_list.numero_de_reference
                WHERE wish_list.adresse_courriel = ?
              `, [userEmail], (err, connection) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(connection);
                    }
                });
            })

            return items
        } catch (error) {
            console.log(error)
        }
    }
    // 

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
}

module.exports = controller;
