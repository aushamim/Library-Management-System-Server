const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");
// const fileUpload = require("express-fileupload");

const app = express();

// middleware area
app.use(cors());
app.use(express.json());
// app.use(fileUpload());

const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sx8wv.mongodb.net/algo-digital?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("library-management");
    const usersCollection = database.collection("users");

    // get area

    // // get all services
    // app.get("/services", async (req, res) => {
    //   const cursor = servicesCollection.find({});
    //   const services = await cursor.toArray();
    //   res.send(services);
    // });

    // //get a specific service

    // app.get("/services/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const service = await servicesCollection.findOne(query);
    //   res.send(service);
    // });

    // // get team members
    // app.get("/team", async (req, res) => {
    //   const cursor = teamCollection.find({});
    //   const team = await cursor.toArray();
    //   res.send(team);
    // });

    // //get orders
    // app.get("/orders", async (req, res) => {
    //   const cursor = ordersCollection.find({});
    //   const orders = await cursor.toArray();
    //   res.send(orders);
    // });

    // //get reviews
    // app.get("/reviews", async (req, res) => {
    //   const cursor = reviewsCollection.find({});
    //   const reviews = await cursor.toArray();
    //   res.send(reviews);
    // });

    // //get single  review
    // app.get("/reviews/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const review = await reviewsCollection.findOne(query);
    //   res.send(review);
    // });

    // // get a specific order
    // app.get("/orders/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const order = await ordersCollection.findOne(query);
    //   res.json(order);
    // });

    // // get admin data
    // app.get("/users/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const query = { email: email };
    //   const user = await usersCollection.findOne(query);
    //   let isAdmin = false;
    //   if (user?.role === "admin") {
    //     isAdmin = true;
    //   }
    //   res.json({ admin: isAdmin });
    // });

    // ------------post area------------

    //post user data
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    // // post a new service
    // app.post("/services", async (req, res) => {
    //   const car = req.body;
    //   const result = await servicesCollection.insertOne(car);
    //   res.json(result);
    // });

    // //update area

    // ----------upsert user----------

    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // // add admin to db
    // app.put("/users/admin", async (req, res) => {
    //   const user = req.body;
    //   const filter = { email: user.email };
    //   const updateDoc = { $set: { role: "admin" } };
    //   const result = await usersCollection.updateOne(filter, updateDoc);
    //   res.json(result);
    // });

    // // delete area

    // //delete order
    // app.delete("/orders/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await ordersCollection.deleteOne(query);
    //   res.json(result);
    // });

    // // delete service
    // app.delete("/services/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await servicesCollection.deleteOne(query);
    //   res.json(result);
    // });

    // // delete review of a user
    // app.delete("/reviews/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await reviewsCollection.deleteOne(query);
    //   res.json(result);
    // });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("LIBRARY MANAGEMENT SERVER");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
