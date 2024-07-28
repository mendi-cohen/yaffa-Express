import { DataTypes } from 'sequelize';
import sequelize from "../../Config/DB.js";

const User = sequelize.define('User', {
    FirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    rule: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  export default User