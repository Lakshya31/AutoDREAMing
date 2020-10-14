const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer')
const port = process.env.PORT || 3001;
const host = process.env.HOST || "localhost";
const Backend = require("./Backend.js");


const Logger = function (req, res, next) {
    console.log(req.url, req.method, req.ip, new Date());
    next();
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, callback) {
        if(file.originalname.indexOf("elementYear") === -1 && file.originalname.indexOf("nodes") === -1) {
            return callback(null, false)
        }

        if(file.originalname.indexOf("elementYear") !== -1){
            file.originalname = "elementYear.csv"
        }

        if(file.originalname.indexOf("nodes") !== -1){
            file.originalname = "nodes.csv"
        }

        callback(null, true)
    }
})

app.use(bodyParser.json());
app.use(cors());
app.use(Logger)


app.post("/", (req, res) => {
    try{
        let x = new Backend();
        x.Process(req.body,res)
    }
    catch{
        res.status(400).json("Error in Processing Requesst")
    }
})

app.get("/download1", (req, res) => {
    res.download(__dirname+"/downloads/nodes.csv", "nodes.csv")
})

app.get("/download2", (req, res) => {
    res.download(__dirname+"/downloads/elementYear.csv","elementYear.csv")
})

app.post("/upload", upload.any(), (req, res) => {
    try{
        if(req.files.length === 2){
            res.status(200).json("Success")
        }
        else{
            res.status(400).json("Wrong File(s)")
        }
    }
    catch{
        res.status(400).json("Error in Processing Files")
    }
})

app.listen(port, host, () => {
    console.log("------------------------------------------------------------------------------------------------------------------------------------------------------------")
    console.log(`\nServer is listening to port ${port} on host: ${host}!\n`);
})