import React, { Component } from 'react'
import Tree from '../Data/data.json';
import Button from 'react-bootstrap/Button';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './Overlay.css';

export default class QuestionCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [[
                "Timing (A1)",
                "Timing (A1) : Too early action (A1.1)",
                "Timing (A1) : Too late action (A1.2)",
                "Timing (A1) : No action (A1.3)",
                "Speed (A2)",
                "Speed (A2): Too high speed (A2.1)",
                "Speed (A2): Too low speed (A2.2)",
                "Distance (A3)",
                "Distance (A3): Too short distance (A3.1)",
                "Direction (A4)",
                "Direction (A4): Wrong direction (A4.1)",
                "Force (A5)",
                "Force (A5): Surplus force (A5.1)",
                "Force (A5): Insufficient force (A5.2)",
                "Object (A6)",
                "Object (A6): Adjacent object (A6.1)",
            ]],
            selection: [],
            papas: [],
            rassi_case_id: "",
        }
    }

    checkOnlyOne = (event) => {
        if (event.target.checked === true) {
            var boxes = document.getElementsByClassName("Checks");
            for (var i = 0; i < boxes.length; i++) {
                if (boxes[i].value !== event.target.value) {
                    boxes[i].checked = false;
                }
            }
        }
    }

    onInput = (event) => {
        this.setState({ [event.target.id]: event.target.value })
    }

    onNext = (id) => {
        if (id === 1) {
            var ch = 0;
            var temp = []
            var boxes = document.getElementsByClassName("Op1");
            for (var i = 0; i < boxes.length; i++) {
                if (boxes[i].checked === true) {
                    ch = 1;
                    this.setState({ selection: [[boxes[i].value]] })
                    temp.push(Tree[boxes[i].value])
                    var newquestions = this.state.questions.slice(0, 1)
                    newquestions.push(temp)
                    this.setState({ questions: newquestions })
                }
            }
            if (ch === 0) {
                alert("Kindly Select a Phenotype!")
            }
        }
        else {
            var ch1 = 0;
            var temp1 = []
            var temp2 = []
            var temp3 = []
            var boxes1 = document.getElementsByClassName("Op" + id);
            for (var j = 0; j < boxes1.length; j++) {
                if (boxes1[j].checked === true) {
                    temp3.push(boxes1[j].getAttribute("papa"))
                    temp2.push(boxes1[j].value);
                    ch1 = 1;
                    if (Tree[boxes1[j].value] !== undefined) {
                        temp1.push(Tree[boxes1[j].value]);
                    }
                    else {
                        temp1.push([]);
                    }

                }
            }
            if (ch1 === 0) {
                alert("Kindly Select a Genotype!")
            }
            else {
                var newquestions1 = this.state.questions.slice(0, id);

                for (let x = 0; x < temp1.length; x++) {                              // To check if the selected set has more genotypes or not
                    if (temp1[x].length !== 0) {
                        newquestions1.push(temp1);
                        break;
                    }
                }

                var newSel = this.state.selection.slice(0, id - 1);
                newSel.push(temp2);

                var newPapa = this.state.papas.slice(0, id - 2);
                newPapa.push(temp3)

                this.setState({ questions: newquestions1, selection: newSel, papas: newPapa }, () => {
                    // console.log(this.state.questions,"\n",this.state.selection,"\n",this.state.papas);
                    var element = document.getElementsByClassName("QCards");
                    element[0].scrollLeft = 10000;
                });
            }
        }
    }

    onFileSelect = (event) => {
        var formdata = new FormData();
        var files = event.target.files;

        for (const file of files) {
            formdata.append('files', file, file.name)
        }

        event.target.value = null;

        if (this.state.rassi_case_id === "") {
            alert("Kindly Enter Case ID");
            return;
        }

        fetch("http://localhost:3001/upload", {
            method: "POST",
            body: formdata
        })
            .then(response => response.json())
            .then(resp => {
                if (resp === "Success") {
                    //Do rest
                    fetch("http://localhost:3001/", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            rassi_case_id: this.state.rassi_case_id,
                            selection: this.state.selection,
                            papas: this.state.papas
                        })
                    })
                        .then(response => response.json())
                        .then(resp => {
                            if (resp === "Success") {
                                window.open("http://localhost:3001/download1");
                                window.open("http://localhost:3001/download2");
                            }
                        })

                }
                else {
                    throw new Error("Error in Files!");
                }
            })
            .catch(error => {
                alert("Error in Uploading Files!")
            })
    }

    onDone = () => {

        if (this.state.selection.length === 0) {
            alert("Please Select Atleast 1 Phenotype!");
            return
        }

        //Now Ask For Uploads to Backend

        confirmAlert({
            title: 'Enter Case ID & Upload Files',
            message: 'Kindly Enter Case ID and Upload "nodes.csv" and "elementYear.csv" Files:',
            buttons: [],
            childrenElement: () =>
                <div>
                    <div style={{ marginTop: "4vh" }}>
                        <label className="TextLabels">Case ID :</label>
                        <input className="InputText" type="text" id="rassi_case_id" onChange={this.onInput} />
                    </div>
                    <div style={{ marginTop: "7vh" }}>
                        <label htmlFor="files" className="btn btn-light" style={{ display: "inline-block" }}>
                            {"Click to Upload Files"}
                            <input type="file" multiple="multiple" className="InputFile" id="files" onInput={this.onFileSelect} />
                        </label>
                    </div>
                </div>

        });
    }

    render() {
        return (
            <div>
                <div className="QCards">
                    <div className="QCard">
                        <div className="Question">
                            <h4 style={{ margin: "10px" }}>1. Phenotype</h4>
                        </div>
                        <div className="Options">
                            <h6 className="SubHeads">Select the cause of accident:</h6>
                            {
                                this.state.questions[0].map(value => {
                                    return (
                                        <label key={value} className="Option">
                                            {/* eslint-disable-next-line */}
                                            <input className={"Checks" + " " + "Op1"} type="checkbox" value={value} onChange={this.checkOnlyOne} />
                                            {value}
                                        </label>
                                    );
                                })
                            }
                        </div>
                        <div></div>
                        <div style={{ position: "absolute", bottom: "0", margin: "15px", width: "100%" }}>
                            <Button onClick={() => { this.onNext(1) }} variant="primary">Next</Button>
                        </div>
                    </div>
                    {
                        this.state.questions.slice(1, this.state.questions.length).map((questions, index) => {
                            return (
                                <div key={index} className="QCard">
                                    <div className="Question">
                                        <h4 style={{ margin: "10px" }}>{index + 2}. Genotype</h4>
                                    </div>
                                    <div className="Options">
                                        {
                                            this.state.questions[index + 1].map((values, ind) => {
                                                return (<div key={ind}>
                                                    <h6 className="SubHeads">{this.state.selection[index][ind] + ":"}</h6>
                                                    {
                                                        values.map(value => {
                                                            return (
                                                                <label key={value} className="Option">
                                                                    {/* eslint-disable-next-line */}
                                                                    <input className={"Checks" + " Op" + (index + 2)} papa={this.state.selection[index][ind]} type="checkbox" value={value} />
                                                                    {value}
                                                                </label>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                );
                                            })
                                        }
                                    </div>
                                    <div></div>
                                    <div style={{ position: "absolute", bottom: "0", margin: "15px", width: "100%" }}>
                                        <Button onClick={() => { this.onNext(index + 2) }} variant="primary">Next</Button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div style={{ borderTop: "2px solid black", paddingTop: "15px", paddingBottom:"10px" }}>
                    <Button onClick={this.onDone} variant="light">Done</Button>
                </div>
            </div>
        )
    }
}
