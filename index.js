const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nuouh7o.mongodb.net/portfolio-backend?appName=Cluster0`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const projectCollection = client.db('portfolio-backend').collection('projects');
        const experienceCollection = client.db('portfolio-backend').collection('experiences');

        app.post('/add-project', async (req, res) => {
            const data = req.body;
            const result = await projectCollection.insertOne(data);
            res.send(result);
        })

        app.get('/all-projects', async (req, res) => {
            const query = {}
            const result = await projectCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/single-project/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = projectCollection.findOne(query);
            res.send(result);
        });

        app.delete('/delete-project/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const result = await projectCollection.findOneAndDelete(query);
            res.status(200).json({
                success: "project deleted Successfully"
            }).send(result);
        })


        app.post('/add-experiences', async (req, res) => {
            const data = req.body;
            const result = await experienceCollection.insertOne(data);
            res.send(result);
        });

        app.get('/all-experiences', async (req, res) => {
            const query = {};
            const result = await experienceCollection.find(query).toArray();
            res.send(result);
        });


        app.get('/single-experience/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = experienceCollection.findOne(query);
            res.send(result);
        });

        app.delete('/delete-experience/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const result = await experienceCollection.findOneAndDelete(query);
            res.status(200).json({
                success: "Experience deleted Successfully"
            }).send(result);
        })

        app.get('/', async (req, res) => {
            res.send('application running Successfully');
        })

        app.listen(port, () => {
            console.log(`Application is running on port ${port}`)
        })
        await client.connect();

    } finally {

    }
}
run().catch(error => {
    console.error(error.message)
});
