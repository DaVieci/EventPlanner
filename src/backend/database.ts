//const MongoClient = require('mongodb').MongoClient;
//const mongoose = require('mongoose');
//const url = 'mongodb://localhost:27017';
//const dbName = 'eventplanner';
//const dbURI = 'mongodb://localhost:27017/eventplanner';
//var connection;
//var db;
/*
console.log(dbURI);

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => console.log('Connected'))
    .catch(err => console.log(err));

module.exports = mongoose;  

function connectDB() {
    console.log('connectDB()');
    connection = MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(client => {
        const db = client.db('dbName');
        console.log('Database ' + dbName + ' set');
    }).then((result) => {
        console.log('Connected to DB');
    }).catch(error => {
        console.log(error);
    });
}

console.log('before connectDB');
connectDB();
module.exports = connection;

const testDocument = ({
    title: 'ACV release',
    body: 'Beste Spiel, maybe?!',
    date: Date(),
    user: {
        name: 'Viet'
    }
})

function insertOneDoc(collection, data) {
    collection.insertOne(data);
}

// Connect to the db
MongoClient.connect(url).then(client => {
    db = client.db('eventplanner'); //select DB
    console.log('DB selected');
    const collection = db.collection('events'); //select collection
    console.log('collection selected');
    return insertOneDoc(collection, testDocument);
}).then(response => {
    console.log('New document inserted: \n', testDocument);
}).catch(error => {
    console.log(error);
});
*/