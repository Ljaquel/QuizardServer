const dotenv = require('dotenv');
const res = dotenv.config();
let envs;

if(process.env.NODE_ENV === 'development') {
  envs = res.parsed;
} else {
  envs = {
    MONGODB: process.env.MONGODB,
    SECRET_KEY: process.env.SECRET_KEY
  }
}

module.exports = envs;