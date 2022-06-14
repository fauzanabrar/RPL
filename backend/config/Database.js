import sequelize from "sequelize";

const db = new sequelize("mosuha_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
  dialectOptions: {
    // useUTC: false, //for reading from database
    dateStrings: true,
    typeCast: true,
  },
  timezone: "+08:00", //for writing to database
});

export default db;
