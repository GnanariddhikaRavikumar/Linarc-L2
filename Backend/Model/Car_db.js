const { DataTypes } = require("sequelize");
const sequelize = require("../database"); 

const TheftCarDetails = sequelize.define("TheftCarDetails", {
    case_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Theft_Date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    Report_Date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    Car_Brand: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Car_Model: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Year_of_Manufacture: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Car_Type: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Fuel_Type: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    Color: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    Registered_State: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Registered_City: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Location_of_Theft: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Time_of_Theft: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    Police_Station: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    Is_Recovered: {
        type: DataTypes.ENUM("Yes", "No"),
        allowNull: false
    },
    Recovery_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    Suspect_Identified: {
        type: DataTypes.ENUM("Yes", "No"),
        allowNull: false
    },
    Number_of_Prev_Thefts: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    GPS_Installed: {
        type: DataTypes.ENUM("Yes", "No"),
        allowNull: false
    },
    CCTV_Availability: {
        type: DataTypes.ENUM("Yes", "No"),
        allowNull: false
    },
    Insurance_Status: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Owner_Age_Group: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
}, {
    tableName: "theftcardetails",
    timestamps: false
});

module.exports = TheftCarDetails;
