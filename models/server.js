const express = require('express');
const cors = require('cors');

const {
    whatsappRoutes
} = require("../routes");

const WhatsappServer = require('./whatsappServer');

require('custom-env').env();

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.HOST_PORT;
        this.apiPaths = {
            whatsapp: '/whatsapp/send'
        };

        // Servidor Whatsapp
        this.whatsapp();

        // Middlewares
        this.middlewares();

        // Rutas
        this.routes();
    }

    whatsapp() {
        const wspServer = WhatsappServer;
        wspServer.listen();
    }

    middlewares() {
        //CORS
        this.app.use(cors({
            origin: `http://localhost:${this.port}`,
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        }));

        // Lectura y parseo del body
        this.app.use(express.json());

        // Rutas
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.apiPaths.whatsapp, whatsappRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Node escuchando en ' + this.port);
        })
    }
}

module.exports = Server;