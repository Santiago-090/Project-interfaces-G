/**
 Modelo de base de datos de la tienda online urban street
**/
/*Creación de la base de datos*/
create database bd_urbanstreet;
/*Llamamos de la base de datos*/
use bd_urbanstreet;

/*Creacion de la tabla de los datos del administrador*/
create table usuarioAdministrador(
    contraseña int not null auto_increment primary key,
    nombreAdmin varchar(50)
);

/*Ingresamos los datos determinados dentro de la tabla*/
insert into usuarioAdministrador(contraseña,nombreAdmin) value(1609,"Administrador");

/*Creacion de la tabla de los datos del almacen*/
create table almacenUrbanStreet(
    nit int not null auto_increment primary key,
    nombreAlm varchar(50),
    telefonoAlm int,
    direccionAlm varchar(50)
);

/*Ingresamos los datos determinados dentro de la tabla*/
insert into almacenUrbanStreet(nit,nombreAlm,telefonoAlm,direccionAlm) value(111345678,"Urban Street",3245600192,"Cra 14 # 14-56");

/*Creacion de la tabla de los datos del cliente*/
create table cliente(
    cedula int not null auto_increment primary key,
    nombreClien varchar(50),
    telefonoClien int,
    correo varchar(50),
    direccionClien varchar(50),
    nitAlm int,
    foreign key(nitAlm) references almacenUrbanStreet(nit)
);

/*Creacion de la tabla de los datos de las categorías*/
create table categoria(
    codigo int not null auto_increment primary key,
    nombreCat varchar(50)
);

/*Ingresamos los datos determinados dentro de la tabla*/
insert into categoria(codigo,nombreCat) value(121212,"Camisetas");
insert into categoria(codigo,nombreCat) value(131313,"Pantalones");
insert into categoria(codigo,nombreCat) value(141414,"Gorras");
insert into categoria(codigo,nombreCat) value(151515,"Accesorios");
insert into categoria(codigo,nombreCat) value(161616,"Perfumeria");

/*Creacion de la tabla de los datos de los productos*/
create table producto(
    numeroReferencia int not null auto_increment primary key,
    cantidad int,
    precio int,
    imagen varchar(50),
    nombreProd varchar(50),
    descripcion varchar(50),
    marca varchar(50),
    codigoCat int,
    foreign key(codigoCat) references categoria(codigo)
);

/*Ingresamos los datos determinados dentro de la tabla*/
insert into producto(numeroReferencia,cantidad,precio,imagen,nombreProd,descripcion,marca,codigoCat) value(4955301,3,50000,"camiseta.jpg","Camiseta FOX","Una camiseta de algodon","Fox",121212);

/*Creacion de la tabla de los datos de los metodos de pago*/
create table metodoPago(
   id int not null auto_increment primary key,
   tipo varchar(50),
   nombreBanco varchar(50),
   imagenQR varchar(50)
);

/*Ingresamos los datos determinados dentro de la tabla*/
insert into metodoPago(id,tipo,nombreBanco,imagenQR) value(494949,"Transferencia Bancolombia a la mano","Bancolombia","BancolombiaalamanoQR.jpg");

/*Creacion de la tabla de los datos de la factura*/
create table compraFactura(
    codigoFactura int not null auto_increment primary key,
    fechaFactura date,
    nitAlmacen int,
    cedulaCliente int,
    numeroReferenciaProducto int,
    metodoPagoId int,
    foreign key(nitAlmacen) references almacenUrbanStreet(nit),
    foreign key(cedulaCliente) references cliente(cedula),
    foreign key(numeroReferenciaProducto) references producto(numeroReferencia),
    foreign key(metodoPagoId) references metodoPago(id)
);