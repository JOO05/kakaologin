require('dotenv').config();

const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;
const algorithm = process.env.JWT_ALG;
const expiresIn = process.env.JWT_EXP;

const option = { algorithm, expiresIn };

function makeToken(payload) {
  return jwt.sign(payload, secretKey, option);
}

function decodePayload(token) {
  return jwt.verify(token, secretKey);
}

module.exports = { makeToken, decodePayload };