// Importar Express

    const express = require('express');
    const path = require('path');
    const bodyParser = require('body-parser')
    const routes = require('./routes');
    const configs = require('./config');
    const db = require('./config/database');
    
    require('dotenv').config({ path: 'variables.env' });

    db.authenticate()
        .then(() => console.log('DB Conectada'))
        .catch(error => console.log(error));

//Configurar Express

    const app = express();

    //habilitar pug
        app.set('view engine', 'pug');

    //añadir vistas
        app.set('views',path.join(__dirname,'./views'));

    //Cargar Carpetas estaticas
        app.use(express.static('public'));

    //Desarrollo o Produccion
        const config = configs[app.get('env')];  
    
    //Variable para el sitio
        app.locals.titulo = config.nombreSitio;

    //Fecha Actual y genera la ru
        app.use((req, res, next) => {
            //Nueva Fecha
            const fecha = new Date();
            res.locals.fechaActual = fecha.getFullYear();
            res.locals.ruta = req.path;
            return next();
        });
    
    //Ejecuatamos body-parser
    app.use(bodyParser.urlencoded({extended: true}));    

    //cargar rutas
        app.use('/', routes());
    
    /** Puerto y host para la app */
    const host = process.env.HOST || '0.0.0.0';
    const port = process.env.PORT || 3000;

    app.listen(port,host, () => {
        console.log('El servidor esta funcionando');
    });

    