require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1gttryf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//database connect
const dbConnect = async () => {
  try {
    client.connect();
    console.log(" Database Connected Successfully✅ ");
  } catch (error) {
    console.log(error.name, error.message);
  }
};
dbConnect();

// Collections Name
const collegeCollection = client.db("appli_crest").collection("colleges");

//Root API
app.get("/", (req, res) => {
  res.send("AppliCrest Is Running....");
});

// Database API's
app.get("/colleges", async (req, res) => {
  const result = await collegeCollection.find().toArray();
  res.send(result);
});

//Sarch college API
app.get("/college/:searchText", async (req, res) => {
  const searchText = req.params.searchText;
  const result = await collegeCollection
    .find({ college_name: { $regex: searchText, $options: "i" } })
    .toArray();
  res.send(result);
});

// get single college
app.get("/colleges/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const result = await collegeCollection.findOne({ _id: new ObjectId(id) });
  res.send(result);
});

// Port Listening
app.listen(port, () => {
  console.log(`AppliCrest is running on Port: ${port}`);
});
