const { Router } = require("express");
const { sendMessage } = require("../controller/whatsapp");
//const { validateField, getComments: getCommentsVal, postComment: postCommentVal, validateToken } = require('../validators');
const router = Router();

router.post("/", [
  //validateField('headers', postTokenVal), // Comprueba si el token existe y tiene el formato correcto
  //validateToken(), // Verifica si el token es válido
  //validateField('body', postCommentVal)
], sendMessage);

module.exports = router;