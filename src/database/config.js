const {Sequelize} = require("sequelize")

const db = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  username: "postgres",
  password: "root",
  database: "academlomotors",
  logging: false,
})

module.exports = { db }