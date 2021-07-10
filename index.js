const express = require('express');
const bodyParser = require('body-parser')
const { MongoClient, ObjectID } = require('mongodb');



const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const uri = "mongodb+srv://mamun-opu:Ep8d7ufmHfWBx1P5@cluster0.dvwsn.mongodb.net/myFood?retryWrites=true&w=majority";


const port = 3000;

app.get('/',(req, res) => {
    res.sendFile(__dirname+'/index.html')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const fruitsCollection = client.db("myFood").collection("summerFood");


    app.post('/addFood', (req, res) => {
        // console.log(req.body);
        const food = req.body;
        fruitsCollection.insertOne(food)
        .then(result => {
            // console.log(result)
            // res.send('data added successfully')
            res.redirect('/');
        })

    })
    app.get('/show/fruits', (req, res) => {
        fruitsCollection.find({})
        .toArray((err, documents)=>{
            res.send(documents);
        })
    })
    app.delete('/delete/:id', (req, res) => {
        fruitsCollection.deleteOne({_id: ObjectID(req.params.id)})
        .then(result => {
            res.send(result.deletedCount > 0);
        })
    })
    app.get('/fruit/:id', (req, res) => {
        fruitsCollection.find({_id: ObjectID(req.params.id)})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })
    app.patch('/update/:id', (req, res) => {
        // const product = req.body;
        fruitsCollection.updateOne({_id: ObjectID(req.params.id)},
            {
                $set: {
                    price: req.body.price, 
                    quantity: req.body.quantity
                }
            }
        )
        .then(result => {
            res.send(result.modifiedCount > 0)
        })
    })

});


app.listen(port, ()=> console.log("listening port at 3000"))