const express = require("express");
const router = require("./Routes/route"); 
const cors = require("cors");

const app = express();

app.use(express.json()); 
app.use(cors());

app.use("/api", router);

app.listen(3002, () => {
    console.log("Server started on port 3002");
});


