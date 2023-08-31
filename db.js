const {MongoClient} = require('mongodb');
// var MongoClient = require('mongodb').MongoClient;

let dbConnection;

module.exports={

    connectToDb:(cb) => {
        MongoClient.connect('mongodb://127.0.0.1:27017/kutuphane')
        .then((client) => {
            dbConnection=client.db()
            return cb()

        }).catch(err => {
            console.log(err);
            console.log("db js dosyasinda baglanti yokkk")
            return cb(err);
        })
    
    },

    getDb:() => dbConnection


}