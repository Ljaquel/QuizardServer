const dotenv = require('dotenv');
const res = dotenv.config();
let envs;

if(process.env.NODE_ENV === 'development') {
  envs = res.parsed;
} else {
  envs = {
    MONGODB: process.env.MONGODB,
    SECRET_KEY: process.env.SECRET_KEY,
    CLOUD_NAME: process.env.CLOUD_NAME,
    API_KEY: process.env.API_KEY,
    API_SECRET: process.env.API_SECRET
  }
}

module.exports = envs;