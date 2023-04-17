var fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const config = require('../config/app-config.js');

var db = fs.readFileSync(path.join(__dirname , 'database.sql')).toString();

con = mysql.createConnection(config.populateCon);

populateDb(db)
.then( () => { console.log('Tables created!') })
.catch(err=> console.log(err))
// populateDb(products).then( () => { console.log('Products table create!') });
// populateDb(sizes).then( () => { console.log('Sizes table create!') });
// populateDb(cart).then( () => { console.log('Cart table create!') });
// populateDb(orders).then( () => { console.log('Orders table create!') });
// populateDb(ordersItems).then( () => { console.log('Orders_items table create!') });

function populateDb(file) {
    return new Promise((resolve,reject) => {
        con.query(file, function (err, result) {
            if(err) {
                reject(new Error(err))
            } else {
                resolve();
            }
        });
    });
}