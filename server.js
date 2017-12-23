const express = require('express');
const DB = require('mongoose');
const msgs = require('./messages');

const Schema = DB.Schema;
const msgSchema = {
    body: String,
    // title: String
}

const DBModel = DB.model('messages', new Schema(msgSchema));


DB.connect('mongodb://admin:admin@ds035985.mlab.com:35985/messages', {useMongoClient: true});
DB.connection.on('connected', x => {
    console.log('connected to Mlab DB');
})

DB.connection.on('error', x => {
    console.log('error during connection');
})



const server = express();

server.get('/messages', (req, res) => {
    console.log('messages requsted');

    DBModel.find({}, (err, docs) => {
        res.send(docs.map(doc => doc.toObject()));
    })
});

server.get('/messages/:id', (req, res) => {
    const id = req.params.id;
    console.log('message by id requested');

    DBModel.findById(id)
       .then(doc => {
            if(!doc) res.send({});
            res.send(doc);
        });
});

server.get('/pushmsgs', (req, res) => {
    DBModel.collection.insertMany(msgs, (err, doc) => {
        console.log('insert success!');
        res.send('insert success!');
    });
});

server.get('/pushsingle', (req, res) => {
    const msg = {
        title: 'single message',
        body: 'this is the single messsage'
    };

    DBModel.collection.insertOne(msg, (err, doc) => {
        console.log('insert success!');
        res.send('insert success!');
    });
});

server.listen(4444);
console.log('server started at port 4444...');