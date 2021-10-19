const dotenv = require('dotenv');
const res = dotenv.config();
let envs;

if(!('error' in res)) {
  envs = res.parsed;
} 
else {
  envs = {
    MONGODB: process.env.MONGODB,
    SECRET_KEY: process.env.SECRET_KEY,
    ENVIRONMENT: process.env.ENVIRONMENT
  }
}

module.exports = envs;