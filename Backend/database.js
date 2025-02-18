const { Sequelize } = require("sequelize");

//Database connection with mysql
const sequelize = new Sequelize("cars", "root", "ravibala@2004", {
    host: "localhost",
    dialect: "mysql",
    logging: false
});

sequelize.authenticate()
    .then(() => console.log("Database connected successfully"))
    .catch(err => console.error("Error connecting to database:", err));

module.exports = sequelize;
