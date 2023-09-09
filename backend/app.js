import express, { response } from 'express' // Nos sirve para crear el servidor.
import morgan from 'morgan' // Nos sirve para pintar las peticiones HTTP request que se solicitan a nuestro aplicación.
import cors from 'cors' // Para realizar solicitudes de un servidor externo e impedir el bloqueo por CORS.
import path from 'path' // Nos permite trabajar con rutas de directorios.
import {MongoClient, ServerApiVersion} from 'mongodb'
require('dotenv').config();

const app = express(); // Inicializamos express.
const uri = process.env.MONGODB_URI;

if (!uri){
    console.log('No se ha especificado la URI de la base de datos');
    process.exit(1);
}

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});



// Middlewares
app.use(morgan('tiny')); // Usamos morgan con el formato tiny.
app.use(cors()); // Usamos cors para evitar el bloqueo de peticiones.
app.use(express.json()) // Nos permite trabajar con el formato json.
app.use(express.urlencoded({ extended: true })); 
//app.use(express.static(path.join(__dirname, 'public')));

function multiplierEdad(objeto,number) {
    const nombre = objeto.nombre.toUpperCase();
    const edad = objeto.edad*number;
    return {nombre, edad};
};

// Rutas
app.get('/', (req, res) => {
  });

app.get('/age', async (req, res) => {
    if (!req.query.nombre) {
        res.status(400).send('Falta el nombre');
        return;
    }
    const nombre = req.query.nombre.toUpperCase();
    try {
        await client.connect();
        const database = client.db("test"); //schema
        const collection = database.collection("persona"); //tabla
        const result = await collection.findOne({nombre:nombre});
        console.log(`resultado: ${JSON.stringify(result)}`);
        if (result){
            res.send(`La edad de ${nombre} es ${result.edad}`);
        } else {
            res.send(`No se ha encontrado a ${nombre}`);
        }
    } finally {
        await client.close();
    }
});

//GET recibir algo
//POST enviar algo
//PUT actualizar algo
//DELETE borrar algo

app.post('/age', async (req, res) => {
    if (!req.query.nombre) {
        res.status(400).send('Falta el nombre');
        return;
    }
    const nombre = req.query.nombre.toUpperCase();
    try {
        await client.connect();
        const database = client.db("test"); //schema
        const collection = database.collection("persona"); //tabla
        const result = await collection.findOne({nombre:nombre});
        console.log(`resultado: ${JSON.stringify(result)}`);
        if (result){
            res.send(`La edad de ${nombre} es ${result.edad}`);
        } else {
            res.send(`No se ha encontrado a ${nombre}`);
        }
    } finally {
        await client.close();
    }
});


app.post('/poto', async (req, res) => {
    if (!req.body.nombre || !req.body.edad || !req.query.multiplier) {
        res.status(400).send('Falta el nombre o la edad o el multiplicador');
        return;
    }
    if (req.query.multiplier<=0){
        res.status(400).send('El multiplicador es menor o igual a 0');
        return;
    }

    console.log(JSON.stringify(req.body));
    const respuesta = multiplierEdad(req.body,req.query.multiplier);

    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Upload respuesta object to MongoDB
        const database = client.db("test"); //schema
        const collection = database.collection("persona"); //tabla
        const result = await collection.insertOne(respuesta);
        console.log(`resultado: ${JSON.stringify(result)}`);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }


    res.send(`before it was ${JSON.stringify(req.body)} ${JSON.stringify(respuesta)}!`);
});
  
// Middleware para Vue.js router modo history
const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

const puerto = process.env.PORT || 4040;

app.listen(puerto, function () {
    // console.log('Example app listening on port '+ puerto);
    console.log(`Example app listening on port ${puerto}!`);
});

