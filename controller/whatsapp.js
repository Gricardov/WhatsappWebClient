const { isNullOrUndefined } = require('../utils/functions');
const WhatsappServer = require('../models/whatsappServer');

const sendMessage = async (req, res) => {

    const { number, message } = req.body;

    try {
        const wspServer = WhatsappServer;

        const result = await wspServer.sendMessage({ number, message });

        if (result.status === 'fulfilled') {
            res.json({ ok: 'ok' });
        } else {
            throw { msg: result?.reason, statusCode: 500 };
        }

    } catch (error) {
        console.log(error);
        res.status((error && error.statusCode) || 500).json({ msg: (error && error.msg) || 'Error de servidor' });
    }
}

module.exports = {
    sendMessage
}

// Para mensajes múltiples

// const promises = Array.from(new Array(2)).map(_ => wspServer.sendMessage({ number, message }));

// await Promise.all(promises);