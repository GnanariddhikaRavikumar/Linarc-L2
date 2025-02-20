const cardetails = require("../Controller/View_Car_details");
const express = require('express')
const router = express.Router();

router.post("/addtheftdetails",cardetails.addcardetails);
router.get("/viewtheftdetails",cardetails.viewtheftdetails);
router.get("/filterdata",cardetails.filterdata);
router.get("/groupdata",cardetails.groupdata);
router.get("/grouporderdata",cardetails.groupdata);
router.get("/fieldvalue",cardetails.fieldvalue);
router.delete("/deletecar",cardetails.deleteCarDetails);

module.exports=router;