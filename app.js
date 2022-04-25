// |->O.o|->>> >>'Jesus Gabriel Morales Tepole'<< <<-|o.O<-|>>>28/04/2022  Se declaran variables de y se descargan sus librerias
//import express from 'express';
const express = require('express')
const { Db } = require('mongodb')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const Schema = mongoose.Schema;
const port = process.env.PORT || 4027

const corsOption = { //|->O.o|->>> >>'Jesus Gabriel Morales Tepole: Se agregan Middlewares
    origin: '*',
    credentials: true,
    //access-control-allow-credentials: true,optioSuccessStatus: 200,
}

//CONEXION DE LA BASE DE DATOS 

app.use(express.json())

app.use(cors(corsOption))

mongoose.connect("mongodb://localhost:27017/mynewdb",{//ABaez 28/04/2022 : Se realiza la conexión a la base de datos. 
    useNewUrlParser:true,
    useUnifiedTopology:true
}, (err)=> {
    if(!err)//ABaez 28/04/2022 : Si es diferente de vacio.
    {
        console.log("connected to db")//ABaez 28/04/2022 : Se muestra que la conexión se realizo con exito. 
    }else {
        console.log(`error to db:  ${err}`)//ABaez 28/04/2022 : Se muestra mensaje de error al realizar la conexión. 
    }
})

//var conn = mongoose.connection;
//module.exports = mongoose;

//SCHEMA Creación del esquema 
const sch= { //ABaez 28/04/2022 : Se crea la estructura del esquema.
    id: Number,
    name : String,
    picture: String,
    price: {type: Number, default: 0},
    category: {type: String, enum: ['computer','phone', 'accesories']},
    description: String
}
const monmodel=mongoose.model("NEWCOL", sch) //ABaez 28/04/2022 : Se carga la estructura en el modelo de mongoose.

//ESUQUE DE LOS CLIENTES QUE COMPRARO.
const ClienteSchema = {//ABaez 28/04/2022 : Se crea estructura de la segunda colección
    Nombre: String,
    Fecha_Compra: Date,
    Pago_Con: Number,
    Dirreccion: String,
    Producto_compra: {type: Schema.ObjectId, ref: "NEWCOL"}//ABaez 30/04/2022 : Se crea relación de esquemas mediante ID
}
const monmodel_Cli = mongoose.model("Cliente",ClienteSchema)


//INSERTAR CLIENTE 
app.post("/Ins_Cliente/", async (req, res) =>{//'Jesus Gabriel|->O.o|->>> >>30/04/2022: Se crea función para insertar cliente 
    //en segundo esquema
    console.log('Insertado Cliente') 
    const data = new monmodel_Cli({
        Nombre: req.body.Nombre,
        Fecha_Compra: req.body.Fecha_Compra,
        Pago_Con: req.body.Pago_Con,
        Dirreccion: req.body.Dirreccion,
        Producto_compra: req.body.Producto_compra
    });
    const result = await data.save();
    res.json(result);
})

//CONSULTAR RELACIÓN CON EL CLIENTE 
app.get("/clientes/", function (req,res){//'Jesus Gabriel|->O.o|->>> >>30/04/2022: Se crea función para consultar 
    console.log('Consultando registro...')
    monmodel_Cli.find({})
    .populate('Producto_compra')
    .then(function(dbcliente){
        res.json(dbcliente);
    }).catch(function(err){
        res.json(err);
    })
})

//DELETE 'Jesus Gabriel|->O.o|->>> >>28/04/2022: Se crea funcion para eliminar en primer esquema
app.delete("/delete/:id", async (req, res) =>{//Se crea el endpoint de eliminar
    try {
        console.log(req.params.id);
        const result = await monmodel.deleteOne({_id:req.params.id}) //Se obtiene el id del parameto ingesado con req.params.id y se elimina un solo docuento con la función deleteOne
        res.send(result)     
    } catch (error) {
        res.send(error)   
    }
    
})


//POST: ABaez 28/04/2022 : Se crea función para insertar en el primer esquema
app.post("/post/", async (req,res)=>{//Se crea el edpoint para insertar el registro.
    console.log('POST /post')
    const data= new monmodel({//Se carga la información de los parametros en la estructura. 
    id: req.body.id,
    name : req.body.name,
    picture :req.body.picture,
    price : req.body.price,
    category : req.body.category,
    description : req.body.description
    }); 
    const val=await data.save ();//Se crea la estructura del documento.
    res.json(val);
})

//CONSULTAR: ABaez 28/04/2022 : Se crea función para consultar en el primer esquema
app.get("/:id", async (req, res) => {//Se crea el edpoint para consultar
    const result = await monmodel.findOne({_id:req.params.id})//Se realiza la consulta por el _id.
    if (result){//Si la consulta trae información. 
        console.log("Registro encontrado")//Se imprime en consola que el registro fue. 
        return  res.json(result);//Se muestra la estructura del documento consultado.
    }else{//Si la consulta no trae información.
        console.log("Registro no econtrado")//Se imprime en consola que el registro no fue encontrado.
        return res.json({
            error:"400",
            mensaje:"Registro no encontrado"
        })
    }   
})

// 'Jesus Gabriel|->O.o|->>> >>28/04/2022: Se crea función para  insertar con parámetros
app.post("/post/Ins/:id/:name/:picture/:price/:category/:description", async (req,res)=>{//Se crea el edpoint para insertar el registro.
    console.log('POST /post')
    const data= new monmodel({//Se carga la información de los parametros en la estructura. 
    id: req.params.id,
    name : req.params.name,
    picture :req.params.picture,
    price : req.params.price,
    category : req.params.category,
    description : req.params.description
    }); 
    const val=await data.save();//Se crea la estructura del documento.
    res.json(val);
})

// 'Jesus Gabriel|->O.o|->>> >>28/04/2022: Función para actualizar registro con parámetros.
app.put("/camb/:id/:name/:price/:category/:description", async (req, res)=>{
    console.log('Actualizando...Registro')
    const result = await monmodel.updateOne(//Se aplica la función updateOne
            {_id:req.params.id},//Se valida por el id el registro a actualizar
            { $set:
                {name: req.params.name,
                price: req.params.price,
                category: req.params.category,
                description: req.params.description}//se actualizará el nombre
        })
        res.json(result);
})

//Jesus Gabriel|->O.o|->>> >>28/04/2022: FUNCIÓN PARA CONSUTAR TODOS LOS REGISTROS
app.get("/ConsultarDB/Tabla_Prod", async (req, res) => {
    const result= await monmodel.find({})
    console.log("Registro encontrado")//Se imprime en consola que el registro fue. 
    return  res.json(result);//Se muestra la estructura del documento consultado.
})


// ABaez 28/04/2022 : Función para actualizar 
app.put("/modificar", async (req, res) =>{//Se crea el edpoint para actualizar
    const body = req.body;
    const result_2 = await monmodel.findOne({id:body.id})//Se consulta si el registro a actualizar existe
    if(result_2){//Si trae información, entonces el registro existe
        const result = await monmodel.updateOne(//Se aplica la función updateOne
            {id:body.id},//Se valida por el id el registro a actualizar
            { $set:{name: body.name}//se actualizará el nombre
        })
        console.log(result);//Se muestra en consola el resultado de la actualización.
        const result_3 = await monmodel.findOne({id:body.id})//Se consulta el registro actualizado
        res.json(result_3);//Se muestra la estructura del documento actualizado
    }else{//Si el registro que se desea actualizar no existe se muestra mensaje de error.
        res.json({
            Error:"400",
            mensaje: "El registro que desea actualzar no existe"
        })
    }   
})





app.listen(port, () => {//AJesus Gabriel|->O.o|->>> >>28/04/2022:: Se usa la funcion exprees 
    console.log(`API REST corriendo en http://localhost: ${port}`)//Jesus Gabriel|->O.o|->>> >>28/04/2022: Muestra mensaje que indica conexion al puerto
})