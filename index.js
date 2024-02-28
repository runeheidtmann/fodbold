require("dotenv").config()

const express = require("express");
const app = express();
app.get('/',(req,res)=>{
    return res
    .status(200).json({
        msg: "working",
        dick: "aha",
        spasser: "næ",
        dickface: "måske"
    })
});

const PORT = process.env.PORT;

app.listen(PORT,()=>{
console.log(`backend running on ${PORT}`);
});