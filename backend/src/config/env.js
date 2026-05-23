require("dotenv").config();

const env = {
  port: Number(process.env.PORT) || 4000,
};

module.exports = env;
