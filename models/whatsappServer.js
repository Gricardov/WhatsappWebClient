const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

// Ruta de la sesión
const SESSION_FILE_PATH = '.session';

class WhatsappServer {

    constructor() {
        // Inicializo el cliente whatsapp
        this.client = new Client({
            qrTimeoutMs: 0,
            puppeteer: {
                headless: true,
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--unhandled-rejections=strict"
                ]
            },
            authStrategy: new LocalAuth({
                dataPath: SESSION_FILE_PATH
            })
        });
        this.isReady = false;

        this.initialize();
    }

    async initialize() {
        console.log('Iniciando Whatsapp...');
        this.client.initialize().catch(err => {
            console.log('Ha ocurrido un error con Whatsapp. Intentando reiniciar: ', err);
            this.isReady = false;
            this.initialize();
        });
    }

    async sendMessage({ number, message }) {
        let err;
        if (this.isReady) {

            const chatId = `${number}@c.us`;

            const registered = await this.client.isRegisteredUser(chatId);

            if (registered) {
                console.log(`Enviando el mensaje de Whatsapp: "${message}" a ${number}`);
                this.client.sendMessage(chatId, message);
                return {
                    status: 'fulfilled'
                }
            }
            else {
                err = `El número ${number} no está registrado en Whatsapp`;
                console.log(err);
                return {
                    status: 'rejected',
                    reason: err
                };
            }
        } else {
            err = `No se pudo enviar el mensaje de Whatsapp: "${message}" a ${number}`;
            console.log(err);
            return {
                status: 'rejected',
                reason: err
            };
        }
    }

    listen() {
        // Generador de QR
        this.client.on('qr', qr => {
            qrcode.generate(qr, { small: true });
        });

        // Evento de autenticación
        this.client.on('authenticated', (session) => {
            console.log('Autenticación de Whatsapp exitosa!');
        });

        this.client.on('disconnected', () => {
            console.log('Se ha desconectado Whatsapp. Intentando reiniciar.');
            this.isReady = false;
            this.initialize();
        });

        this.client.on('auth_failure', () => {
            this.isReady = false;
            console.log('Autenticación de Whatsapp fallida!');
        });

        this.client.on('ready', () => {
            this.isReady = true;
            console.log('Whatsapp listo para usar!');
        });

        this.client.on('message', message => {
            if (message.body === 'ping') {
                message.reply('pong');
            }
        });
    }

    /*notify(message) {
        console.log('Message: ' + message);
    }*/
}
module.exports = new WhatsappServer();