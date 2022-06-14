import sequelize from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = sequelize;

const mosuhaSensor = db.define(
  "mosuha_sensor",
  {
    temp: {
      type: DataTypes.FLOAT,
    },
  },
  {
    freezeTableName: true,
  }
);

export default mosuhaSensor;
