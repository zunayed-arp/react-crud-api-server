const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId

const app = express();
const port = process.env.PORT || 5000;

//middlewire
app.use(cors())
app.use(express.json())

// user: emaDbUser
// pass: 0G1VH3T4NES0un9c

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ch3vz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
	try {
		await client.connect();
		const database = client.db("foodMaster");
		const usersCollection = database.collection('users');

		//GET API

		app.get('/users', async (req, res) => {
			const cursor = usersCollection.find({});
			const users = await cursor.toArray();
			res.send(users)

		});

		//dynamic data load using ID
		app.get('/users/:id', async (req, res) => {
			const id = req.params.id;

			const query = { _id: ObjectId(id) };
			const user = await usersCollection.findOne(query);
			console.log("find an user using id", user)
			console.log('load users with id', id)
			res.json(user)
		})



		//POST API
		app.post('/users', async (req, res) => {
			const newUser = req.body;
			const result = await usersCollection.insertOne(newUser);
			console.log('New User hitting the api', req.body)
			console.log('added user', result)
			res.send(req.body)
		});


		// update API

		app.put('/users/:id', async(req,res)=>{
			const id = req.params.id;
			const updatedUser = req.body;
			const filter ={_id:ObjectId(id)};
			const options = {upsert:true};
			const updateDoc = {
				$set:{
					name:updatedUser.name,
					email:updatedUser.email
				},
			};
			const result = await usersCollection.updateOne(filter,updateDoc,options);
			console.log('updating user',req);
			// res.send('updating not dating');
			res.json(result);
		})





		// DELETE API
		app.delete('/users/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await usersCollection.deleteOne(query)
			console.log('deleteing users with id', id);
			console.log('deleted result ', result)

			// res.send('going to delete')
			res.json(result);
		})







		// // create a document to insert
		// const user = {
		// 	title: "akifa jenia",
		// 	content: "aj@hotmail.com",
		// }

		// const result = await usersCollection.insertOne(user);

		// console.log(`A document was inserted with the _id: ${result.insertedId}`);




	}
	finally {
		//await client.close();
	}
}

run().catch(console.dir)









// client.connect(err => {
// 	const collection = client.db("test").collection("devices");
// 	collection.insertOne({ name: 'durjoy', email: 'dj@china.com' })
// 		.then(() => {
// 			console.log('inserted')
// 		})
// 	// perform actions on the collection object
// 	// client.close();
// });





app.get('/', (req, res) => {
	res.send('Running the server crud');
})


app.listen(port, () => {
	console.log('Listening port at ', port);
})