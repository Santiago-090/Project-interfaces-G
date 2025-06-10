// se hace el requerimiento del mysql
const mysql = require('mysql')

// se hace la conexion al servidor localHost
const conection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'bd_urbanstreet'
})

// aqui comprobamos de que la conexion y el servidor funcionen 
conection.connect( (err) =>{
    if(err) throw err
    console.log('La conexion funciona')
})


conection.end()