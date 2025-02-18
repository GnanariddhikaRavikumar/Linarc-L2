const car = require("../Model/Car_db");
const { Sequelize } = require("sequelize");

exports.addcardetails=async(req,res)=>{
    try {
        const theftdetails=car.create(req.body);
        res.status(200).json({message:"Theft Details of car added",data:theftdetails});
    }
    catch(err)
    {
        res.status(500).json({error:"Can't add the details"});
    }
}

exports.viewtheftdetails=async(req,res)=>{
    try{
        const details = await car.findAll();
        res.json(details);
    }
    catch(err){
        res.status(500).json({error:"Data can't be fetched"});
    }
}

exports.filterdata=async (req, res) => {
    try {
        const whereClause = {};

        Object.keys(req.query).forEach((key) => {
            whereClause[key] = req.query[key];
        });

        const results = await car.findAll({ where: whereClause });
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.groupdata=async(req,res)=>{
    try{
        const { orderBy = "case_ID", order = "ASC" } = req.query;
        const validColumns = [
            "case_ID", "Theft_Date", "Report_Date", "Car_Brand", "Car_Model",
            "Year_of_Manufacture", "Car_Type", "Fuel_Type", "Color", "Registered_State",
            "Registered_City", "Location_of_Theft", "Time_of_Theft", "Police_Station",
            "Is_Recovered", "Recovery_Date", "Suspect_Identified", "Number_of_Prev_Thefts",
            "GPS_Installed", "CCTV_Availability", "Insurance_Status", "Owner_Age_Group"
        ];

        if (!validColumns.includes(orderBy)) {
            return res.status(400).json({ error: "Invalid orderBy column" });
        }

        // Fetch sorted data
        const theftCarDetails = await car.findAll({
            order: [[orderBy, order.toUpperCase() === "DESC" ? "DESC" : "ASC"]]
        });

        res.json(theftCarDetails);
    }
    catch(error){
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


//manual filter
exports.fieldvalue = async (req, res) => {
    try {
        const columnName = req.query.column;

        if (!columnName) {
            return res.status(400).json({ error: "Column name is required" });
        }

        const distinctValues = await car.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col(columnName)), columnName]]
        });

        // Extract the distinct values into an array
        const valuesArray = distinctValues.map(item => item[columnName]);

        // Return the array of distinct values
        res.json(valuesArray);
    } catch (err) {
        console.error("Error fetching distinct values:", err);
        res.status(500).json({ error: "Data can't be fetched" });
    }
};
