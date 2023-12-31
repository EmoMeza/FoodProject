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


//GET recibir algo
//POST enviar algo
//PUT actualizar algo
//DELETE borrar algo
app.get('/get/all/comidas', async (req, res) => {
    try{
        //connect to the database
        await client.connect();
        const database = client.db("foodproject");
        const collection = database.collection("comidas");
        //get all comidas inside the collection
        const result = await collection.find({}).toArray();
        //send the result back to the client
        res.json(result);
    }catch(error){
        console.log(error);
        res.json({message: "error"});
    } finally{
        await client.close();
    }
});

app.post('/add/comida', async (req, res) => {
    const data = req.body;
    console.log(data);
    //set nombre to lowercase
    const nombre_lowercase= data.nombre.toLowerCase();
    try {
        //connect to the database
        await client.connect();
        const database = client.db("foodproject");
        const collection = database.collection("comidas");
        //check if the name already exists in the database, take in mind that the name in the database is not in lowercase, but the nombre im using to search is
        const result = await collection.findOne({ nombre: { $regex: new RegExp(`^${nombre_lowercase}$`, 'i') } });
        //if the name already exists, return an error message
        if(result){
            res.json({message: "The name already exists"});
        }
        else{
            const insertResult = await collection.insertOne(data);
            res.json(insertResult);
        }
    } catch (error) {
        console.log(error);
        res.json({ message: "error" });
    } finally {
        await client.close();
    }
});

app.put('/update/comida', async (req, res) => {
    const id_comida = req.body.id_comida;
    const data = req.body;
    console.log(data);
    try{
        //connect to the database
        await client.connect();
        const database = client.db("foodproject");
        const collection = database.collection("comidas");
        //update the data into the database
        const result = await collection.updateOne({id_comida: data.id_comida}, {$set: data});
        //send the result back to the client
        res.json(result);
    }catch(error){
        console.log(error);
        res.json({message: "error"});
    }finally{
        await client.close();
    }
});

app.delete('/delete/comida', async (req, res) => {
    const id_comida = req.body.id_comida;
    console.log(id_comida);
    try{
        //connect to the database
        await client.connect();
        const database = client.db("foodproject");
        const collection = database.collection("comidas");
        //insert the data into the database
        const result = await collection.deleteOne({id_comida: id_comida});
        //send the result back to the client
        res.json(result);
    }catch(error){
        console.log(error);
        res.json({message: "error"});
    } finally{
        await client.close();
    }
});

//Menu endpoints

app.get('/get/all/menus', async (req, res) =>{
    try{
        //connect to the database
        await client.connect();
        const database = client.db("foodproject");
        const collection = database.collection("menus");
        //get all comidas inside the collection
        const result = await collection.find({}).toArray();
        //send the result back to the client
        res.json(result);
    }catch(error){
        console.log(error);
        res.json({message: "error"});
    } finally{
        await client.close();
    }
});

app.post('/add/menu', async (req, res) => {
    const data = req.body;
    const guerra = data.guerra.toLowerCase();
    const top = data.top.toLowerCase();

    const date = new Date();
    const id_menu = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();

    const pedidos = [];
    data.pedidos = pedidos;

    data.id_menu = id_menu;

    try {
        await client.connect();
        const database = client.db("foodproject");
        const menus = database.collection("menus");
        const comidas = database.collection("comidas");

        const resultGuerra = await comidas.findOne({ nombre: { $regex: new RegExp(`^${guerra}$`, 'i') } });
        const resultTop = await comidas.findOne({ nombre: { $regex: new RegExp(`^${top}$`, 'i') } });

        if (!resultGuerra) {
            const comida = { nombre: data.guerra, lista: [] };
            const insertResult = await comidas.insertOne(comida);
            data.guerra = insertResult.insertedId;
        } else {
            data.guerra = resultGuerra._id;
        }

        if (!resultTop) {
            const comida = { nombre: data.top, lista: [] };
            const insertResult = await comidas.insertOne(comida);
            data.top = insertResult.insertedId;
        } else {
            data.top = resultTop._id;
        }

        const insertResult = await menus.insertOne(data);
        res.send(insertResult);
    } catch (error) {
        console.log(error);
        res.json({ message: "error" });
    } finally {
        await client.close();
    }
});

app.put('/update/menu', async (req, res) => {
    const data = req.body;
    const id_menu = data.id_menu;

    const guerra = data.guerra.toLowerCase();
    const top = data.top.toLowerCase();

    try{
        //connect to the database
        await client.connect();
        const database = client.db("foodproject");
        const collection = database.collection("menus");
        const comidas = database.collection("comidas");

        const resultGuerra = await comidas.findOne({ nombre: { $regex: new RegExp(`^${guerra}$`, 'i') } });
        const resultTop = await comidas.findOne({ nombre: { $regex: new RegExp(`^${top}$`, 'i') } });

        if (!resultGuerra) {
            const comida = { nombre: data.guerra, lista: [] };
            const insertResult = await comidas.insertOne(comida);
            data.guerra = insertResult.insertedId;
        } else {
            data.guerra = resultGuerra._id;
        }

        if (!resultTop) {
            const comida = { nombre: data.top, lista: [] };
            const insertResult = await comidas.insertOne(comida);
            data.top = insertResult.insertedId;
        } else {
            data.top = resultTop._id;
        }
        //update the data into the database
        const result = await collection.updateOne({id_menu: id_menu}, {$set: data});
        //send the result back to the client
        res.json(result);
    }catch(error){
        console.log(error);
        res.json({message: "error"});
    }finally{
        await client.close();
    }
});

app.delete('/delete/menu', async (req, res) => {
    const id_menu = req.body.id_menu;
    console.log(id_menu);
    try{
        //connect to the database
        await client.connect();
        const database = client.db("foodproject");
        const collection = database.collection("menus");
        //insert the data into the database
        const result = await collection.deleteOne({id_menu: id_menu});
        //send the result back to the client
        res.json(result);
    }catch(error){
        console.log(error);
        res.json({message: "error"});
    } finally{
        await client.close();
    }
});

app.get('get/today/menu', async (req, res) => {
    const today = new Date();
    today = today.getDate() + "-" + today.getMonth() + "-" + today.getFullYear();
    console.log(today);
    try{
        //connect to the database
        await client.connect();
        const database = client.db("foodproject");
        const collection = database.collection("menus");
        //get all comidas inside the collection
        const result = await collection.findOne({id_menu: today});
        //send the result back to the client
        res.json(result);
    }catch(error){
        console.log(error);
        res.json({message: "error"});
    }finally{
        await client.close();
    }
});

//Pedidos endpoints

app.get('/get/all/pedidos', async (req, res) =>{

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

