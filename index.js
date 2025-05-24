const express = require("express");

const cors = require("cors");

require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

// user plant-trackers

// password ibd2DxD63PE3jNn8

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vwcukbn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

//const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.vwcukbn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();

    const plantsCollection = client.db("plantDB").collection("plants");

    app.post("/plants", async (req, res) => {
      const newPlant = req.body;
      console.log(newPlant);

      const result = await plantsCollection.insertOne(newPlant);

      res.send(result);
    });

    app.get("/plants", async (req, res) => {
      const result = await plantsCollection.find().toArray();
      res.send(result);
    });

    // view detatails er get

    app.get("/plant/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };

      const result = await plantsCollection.findOne(query);

      res.send(result);
    });

    // my-plants er get

    app.get("/plants/:email", async (req, res) => {
      const email = req.params.email;

      console.log(email);
      const result = await plantsCollection.find({ email }).toArray();
      res.send(result);
    });

    

    
    // new-plant section last 6ta data

    app.get("/new_plants", async (req, res) => {
      try {
        const result = await plantsCollection
          .find()
          .sort({ _id: -1 }) //  Latest data first
          .limit(6) //  Last 6 only
          .toArray();

        res.send(result);
      } catch (error) {
        console.error("Error fetching plants:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });

    // delet plant

    app.delete("/del_plant/:id", async (req, res) => {
      const id = req.params.id;
      //console.log('to be deleted', id)

      const query = { _id: new ObjectId(id) };

      const result = await plantsCollection.deleteOne(query);

      res.send(result);
    });

    // update plant

    app.get("/updatePlant/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };

      const result = await plantsCollection.findOne(query);

      res.send(result);
    });

    app.put("/plant/:id", async (req, res) => {
      const id = req.params.id;

      const {
        _id,
        photo,
        plant_name,
        category,
        frequency,
        last_watered_data,
        next_watering_data,
        care_level,
        health_status,
      } = req.body;

      const query = { _id: new ObjectId(id) };

      //const options  = {upsert : true};

      // const updatedPlant = req.body;

      // const updatedDoc = {
      //   $set: updatedPlant
      // }

      const updateData = {
        $set: {
          // _id,
          photo,
          plant_name,
          category,
          frequency,
          last_watered_data,
          next_watering_data,
          care_level,
          health_status,
        },
      };

      const result = await plantsCollection.updateOne(
        query,
        updateData,
        
      );

      res.send(result);
    });

    // app.get("/update_plant/:id", async (req, res) => {
    //   const id = req.params.id;

    //   const query = { _id: new ObjectId(id) };

    //   const result = await plantsCollection.findOne(query);

    //   res.send(result);
    // });

    // app.put('/plants/:id', async(req,res) =>{
    //       const id = req.params.id;

    //       const filter = {_id : new ObjectId(id)}

    //       const options  = {upsert : true};

    //       const updatedPlant = req.body;

    //       const updatedDoc = {
    //         $set: updatedPlant
    //       }

    //       const result = await plantsCollection.updateOne(filter, updatedDoc, options);

    //   res.send(result);
    // })

    //

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("plant tracker server is running");
});

app.listen(port, () => {
  console.log(`plant-tracker server is running on port ${port}`);
});


// 7th