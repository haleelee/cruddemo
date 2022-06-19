console.log('May Node be with you');
const express = require('express');
const bodyParser = require('body-parser');
const { query } = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb+srv://haleelee:ManuGinobili31!@cluster0.rlbic.mongodb.net/?retryWrites=true&w=majority'

// this is the connection to the external database. This code also uses promises instead of callbacks
MongoClient.connect(connectionString, {
useUnifiedTopology: true})
    .then(client =>{
        console.log('Connected to Database');
        const db = client.db('star-wars-quotes');
        const quotesCollection = db.collection('quotes');
        
        app.set('view engine', 'ejs')
        
        // Make sure you place body-parser before your CRUD handlers!
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(express.static('public'))
        app.use(bodyParser.json())

        app.get('/', (req, res) =>{
            // res.send("Hello, world")
            quotesCollection.find().toArray()
                .then(results => {
                    console.log(results)
                    res.render('index.ejs', { quotes: results })
                })
                .catch(error => console.error(error))
            // const cursor = db.collection('quotes').find();
            // console.log(cursor);
        });
        
        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
            .then(result => {
                console.log(result);
                res.redirect('/'); //the slash means 'root' or 'home'
            })
            .catch(error => console.error(error))
        });

        app.put('/quotes', (req, res) => {
            // console.log(req.body)
            quotesCollection.findOneAndUpdate(
            { name: 'Yoda' },
            {
                $set: {
                    name: req.body.name,
                    quote: req.body.quote
                }
            },
            {
                upsert: true
            }
        )
        .then(result => {
            res.json('Success')
        })
        .catch(error => console.error(error))
    })

        app.delete('/quotes', (req, res) =>{
            quotesCollection.deleteOne(
                { name: req.body.name},
            )
            .then(result => {
                if(result.deletedCount === 0){
                    return res.json('No quote to delete')
                }
                res.json("Deleted Darth Vader's quote")
            })
            .catch(error => console.error(error))
        })
    

        app.listen(3000, function(){
            console.log('listening on 3000')
        });
        
    })
    .catch(error => console.error(error))






