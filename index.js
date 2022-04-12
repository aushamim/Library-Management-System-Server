const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");

const app = express();

// middleware area
app.use(cors());
app.use(express.json());

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
    const booksCollection = database.collection("books");
    const postsCollection = database.collection("posts");

    // ---------get area---------

    // get all users
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    // //get a specific user
    // app.get("/users/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const user = await usersCollection.findOne(query);
    //   res.send(user);
    // });

    // get all the books
    app.get("/books", async (req, res) => {
      const cursor = booksCollection.find({});
      const books = await cursor.toArray();
      res.send(books);
    });

    //get a specific book
    app.get("/books/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const book = await booksCollection.findOne(query);
      res.send(book);
    });

    //get posts
    app.get("/posts", async (req, res) => {
      const cursor = postsCollection.find({});
      const posts = await cursor.toArray();
      res.send(posts);
    });

    //get single  post
    app.get("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const posts = await postsCollection.findOne(query);
      res.send(posts);
    });

    // get admin data
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // ------------post area------------//

    //post user data
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    // post a new book
    app.post("/books", async (req, res) => {
      const book = req.body;
      const result = await booksCollection.insertOne(book);
      res.json(result);
    });

    // post a new post
    app.post("/posts", async (req, res) => {
      const post = req.body;
      const result = await postsCollection.insertOne(post);
      res.json(result);
    });

    //---------update area---------//

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

    // add admin to db
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // change admin to user
    app.put("/users/makeUser", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "user" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // -----------delete area-----------//

    //delete post
    app.delete("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await postsCollection.deleteOne(query);
      res.json(result);
    });

    // delete books
    app.delete("/books/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await booksCollection.deleteOne(query);
      res.json(result);
    });
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
