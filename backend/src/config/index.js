const dotenv = require('dotenv');

const conf = {
    path: process.env.ENV_CONFIG_PATH
}
dotenv.config(process.env.ENV_CONFIG_PATH ? conf : undefined);

module.exports = {
    port: Number(process.env.APP_PORT) || 8080,
    db: {
        url: process.env.DATABASE_URI || "localhost",
        userName: process.env.DATABASE_USERNAME || "test",
        password: process.env.DATABASE_PASSWORD || "test",
        dbName: process.env.DATABASE_NAME || "IOT",
    },
    jwt: {
        privKey: process.env.JWT_PRIV_KEY,
        pubKey: process.env.JWT_PUB_KEY,
    },
} 