const config = require('../config/app-config.js');
const mysql = require('mysql');

const controller = class UsersController {
    constructor() {
        // mysql connection
        this.con = mysql.createConnection(config.sqlCon);
     }

    save(user) {
        this.con.query('INSERT INTO users SET ?', user, function (err, result) {
            if (err) throw error;
        });
    }

    getUserByEmail(email){
        return new Promise((resolve,reject) => {
            this.con.query('SELECT * FROM `Clients` WHERE `adresse_courriel` = "'+email+'"', function (err, result) {
                if (result.length < 1) {
                    reject(new Error("User not found"));
                } else {
                    resolve(result[0]);
                }
            });
        });
    }

    isAdmin(id){
        return new Promise((resolve,reject) => {
            this.con.query('SELECT * FROM `Clients` WHERE `id` = "'+id+'"', function (err, result) {
                if (result == undefined) {
                    reject(new Error("User not found"));
                } else {
                    if (result[0].user_type) resolve(result[0].user_type);
                    reject();
                }
            });
        });
    }

    getUserById(id){
        return new Promise((resolve,reject) => {
            this.con.query('SELECT * FROM `Clients` WHERE `adresse_courriel` = "'+id+'"', function (err, result) {
                if (result.length < 1) {
                    reject(new Error("User not found"));
                } else {
                    resolve(result[0]);
                }
            });
        });
    }

    update(name, email, user) {
        return new Promise((resolve,reject) => {
            this.con.query('UPDATE `Clients` SET `name` = ? , `email` = ? WHERE `id` = ?', [name,email,user] , function (err, result) {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve('Success');
                }
            });
        });
    }

    updatePassword(hashed, user) {
        return new Promise((resolve,reject) => {
            this.con.query('UPDATE `Clients` SET `password` = ? WHERE `id` = ?', [hashed,user] , function (err, result) {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve('Success');
                }
            });
        });
    }

    getEmployees() {
        return new Promise((resolve,reject) => {
            this.con.query('SELECT * FROM `Clients` WHERE `user_type` in ("employee","admin")' , function (err, result) {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(result);
                }
            });
        });
    }

    updateEmployee(user, id) {
        return new Promise((resolve,reject) => {
            this.con.query('UPDATE `Clients` SET ? WHERE `id` = ?', [user, id] , function (err, result) {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve('Account changes saved successfully');
                }
            });
        });
    }
}

module.exports = controller;