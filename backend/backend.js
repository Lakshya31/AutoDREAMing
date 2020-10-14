const fs = require('fs');
const csv = require('@fast-csv/parse');
const { writeToPath } = require('@fast-csv/format');

class Backend {
    constructor() {
        this.nodes = [];
        this.node_types = [];
        this.elementYear = [];
    }

    async ReadNodeType() {
        await new Promise((resolve, reject) => {
            csv.parseFile(__dirname + "/data/node_type.csv", { delimiter: "|" })
                .on('error', error => console.error(error))
                .on('data', row => { this.node_types.push(row) })
                .on('end', rowCount => { resolve(); });
        })
    }

    async ReadNodes() {
        await new Promise((resolve, reject) => {
            csv.parseFile(__dirname + "/uploads/nodes.csv", { delimiter: "|" })
                .on('error', error => console.error(error))
                .on('data', row => { this.nodes.push(row) })
                .on('end', rowCount => { resolve(); });
        })
    }

    async ReadElementYear() {
        await new Promise((resolve, reject) => {
            csv.parseFile(__dirname + "/uploads/elementYear.csv", { delimiter: "|" })
                .on('error', error => console.error(error))
                .on('data', row => { this.elementYear.push(row) })
                .on('end', rowCount => { resolve(); });
        })
    }

    MakeElementYear(req) {
        let newelementyear = [];
        newelementyear.push(req.rassi_case_id);
        newelementyear.push(".");
        newelementyear.push(".");
        newelementyear.push(".");
        newelementyear.push(".");
        newelementyear.push(".");
        newelementyear.push(req.rassi_case_id);
        newelementyear.push(".");
        newelementyear.push(".");
        this.elementYear.push(newelementyear);
    }

    MakeNodes(req) {
        let { rassi_case_id, selection, papas } = req;
        let count = 1
        let Types = {}
        let IDS = {}
        for(let i=0;i<selection.length;i++){
            for(let j=0;j<selection[i].length;j++){
                let select = selection[i][j];
                let parent = "";
                let subtype = "";
                let temp_node = [];
                let pstart = "";
                let pend = "";
                let pcode = "";
                let pid = "";

                if(i!==0){
                    parent = papas[i-1][j];
                }

                let id = rassi_case_id+"-"+count.toString().padStart(3,'0');

                count += 1;

                if(select.indexOf(":") !== -1){
                    select = select.split(":")[1]
                }

                if(parent.indexOf(":") !== -1){
                    parent = parent.split(":")[1]
                }

                IDS[select] = id

                if(parent !== ""){
                    pstart = parent.indexOf("(");
                    pend = parent.indexOf(")")+1;
                    pcode = parent.slice(pstart,pend);
                }
                

                let start = select.indexOf("(");
                let end = select.indexOf(")")+1;
                let code = select.slice(start,end);

                let index = -1

                for(let k=0; k<this.node_types.length; k++){
                    if(this.node_types[k][2].indexOf(code) !== -1){
                        index = k;
                        break;
                    }
                }

                if(index === -1){
                    Types[code] = ".";
                }
                else{
                    Types[code] = this.node_types[index][0];
                }

                if(parent !== ""){
                    // subtype = Types[pcode];
                    pid = IDS[parent]
                }

                if(parent === ""){
                    // subtype = ".";
                    pid = "";
                }

                temp_node.push(id);
                temp_node.push(".");
                temp_node.push(".");
                temp_node.push(".");
                temp_node.push(".");
                temp_node.push(rassi_case_id);
                temp_node.push(".");
                temp_node.push(".");
                temp_node.push(Types[code]);
                temp_node.push(pid);
                temp_node.push(".");

                this.nodes.push(temp_node)
            }
        }
    }

    async WriteNodes(){
        await new Promise((resolve,reject) => {
            writeToPath(__dirname+"/downloads/nodes.csv", this.nodes, {delimiter:"|"})
            .on('error', err => console.error(err))
            .on('finish', () => {resolve();});
        })
    }

    async WriteElementYear(){
        await new Promise((resolve,reject) => {
            writeToPath(__dirname+"/downloads/elementYear.csv", this.elementYear, {delimiter:"|"})
            .on('error', err => console.error(err))
            .on('finish', () => {resolve();});
        })
    }

    async Process(req, res) {
        await Promise.all([
            this.ReadNodeType(),
            this.ReadNodes(),
            this.ReadElementYear(),
        ])
        .catch( e => {
            res.status(400).json("Error")
        })

        this.MakeNodes(req)
        this.MakeElementYear(req)

        await Promise.all([
            this.WriteNodes(),
            this.WriteElementYear(),
        ])
        .catch( e => {
            res.status(400).json("Error")
        })
        
        res.status(200).json("Success")
    }

}

module.exports = Backend;