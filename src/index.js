import React, { Component } from "react";
import ReactDOM from "react-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from '@material-ui/core/ListSubheader';
import DoneIcon from '@material-ui/icons/Done';
import SearchIcon from '@material-ui/icons/Search';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import update from 'react-addons-update';
import {case0, case1, case2, case3} from "./cases"
import Grid from '@material-ui/core/Grid';
import "./styles.css";

class ItemList extends Component {

    constructor(props) {
        super(props);
        this.makeSubheader = this.makeSubheader.bind(this)
    }

    makeItem (item) {
        return (
            <ListItem key={item}>
                <ListItemIcon>
                    {this.props.icon}
                </ListItemIcon>
                <ListItemText primary={item} />
            </ListItem>
        )
    }

    makeSubheader() {
        return (
            <ListSubheader>{this.props.subheader}</ListSubheader>
        )
    }

    render () {
        return (
            <List
                dense
                subheader={this.makeSubheader()}
            >
                {this.props.items.map(this.makeItem.bind(this))}
            </List>
        )
    }
}

class ShowOptionList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (this.props.numHits >= this.props.numHitsRequired) {
      return (
        <OptionList
          itemObject={this.props.options}
          handleClick={this.props.handleClick}
        />
      );
    } else {
      return <p>You do not have enough hits. </p>;
    }
  }
}

Array.prototype.diff = function(a) {
  return this.filter(function(i) {
    return a.indexOf(i) < 0;
  });
};

class OptionList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderListItem(key, index) {
    return (
      <ListItem
        button
        key={key}
        onClick={() => this.props.handleClick(this.props.itemObject[key])}
      >
        <ListItemText
          primary={key}
          secondary={"Codeword: " + this.props.itemObject[key]}
        />
      </ListItem>
    );
  }

  render() {
    return (
      <div>
        <h2>Your options and their codewords are:</h2>
        <List>
          {Object.keys(this.props.itemObject).map(
            this.renderListItem.bind(this)
          )}
        </List>
      </div>
    );
  }
}

class MainFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hits: [],
      attempts: [],
      input: "",
        invalidInput: true,
        stationTitle: this.props.case.stationTitle,
        stemText: this.props.case.stemText,
        patient: this.props.case.patient,
        options: this.props.case.options,
        numHitsRequired: this.props.case.numHitsRequired,
        stationNo: this.props.stationNo,
    };
      this.notifyHits = () => toast.info("You've got enough hits! Scroll down to see the options and select one.");
  }

    onChangeText(e) {
    this.setState({ input: e.target.value });
    if (e.target.value.length > 3) {
      this.setState({ invalidInput: false });
    } else {
      this.setState({ invalidInput: true });
    }
  }

  onEnterText(e) {
    e.preventDefault();
    if (this.state.input.length > 3) {
      var all_hits = this.state.patient.filter(a =>
        a.toLowerCase().includes(this.state.input.toLowerCase())
      );
      var current_hits = all_hits.filter(x => !this.state.hits.includes(x));
      if (current_hits.length > 0) {
        this.setState(prevState => ({
          hits: [...prevState.hits, ...current_hits],
          attempts: [...prevState.attempts, this.state.input]
        }));
          if (this.state.hits.length == (this.state.numHitsRequired - 1)) {
              this.notifyHits()
          }
      } else {
        this.setState(prevState => ({
            attempts: [...prevState.attempts, this.state.input]
        }));
      }
        this.setState({ input: "" });
    }
  }

  render() {
    return (
        <div className="main-frame">
            <page>
                <div className="stem">
                    <h1>CANDIDATE INSTRUCTIONS</h1>
                    <div className="contact">
                        jwu202 at student.monash.edu for questions. Feedback appreciated!
                    </div>
                    <br />
                    <br />
                    <div className="details">
                        <b>Station No: </b> {this.state.stationNo}
                        <br />
                        <b>Station Title: </b> {this.state.stationTitle} <br />
                        <b>Station Time: </b> Unlimited :) <br />
                    </div>
                    <br />
                    <p>{this.state.stemText}</p>
                    <b>TASKS:</b>
                    <ol>
                        <li>
                            Achieve {this.state.numHitsRequired} hits and gather enough
                            information to come to a diagnosis!
                        </li>
                    </ol>
                    <b>IMPORTANT NOTES:</b>
                    <br />
                    <ul>
                        <li>
                            <b>DO NOT</b> change tabs until you have completed this case -
                            you will lose all your information! Only change tabs once you
                            have been presented with your options and selected one - then
                            it's okay.
                        </li>
                        <li>
                            Input any HoPC questions, symptoms, risk factors, or examination
                            findings you would like to know.
                        </li>
                        <li>
                            Where possible, use the most
                            succinct descriptor (e.g. "dyspnoea" instead of
                            shortness of breath).
                        </li>
                        <li>
                            Your inputs need to be a minimum of <b> 4 characters</b>.
                        </li>
                        <li>
                            Inputs should be medical terminology for a <b>specific </b>
                            finding, symptom or risk factor.
                        </li>
                        <li>
                            Once you have achieved <b>{this.state.numHitsRequired} hits</b>,
           you will be presented with options, and the corresponding
      codeword. Click your option and the tab name will change to the
      codeword. Then progress to the next tab, or, if this is Station
      4, send your list of 4 codewords to the live chat!
                        </li>
                    </ul>
                </div>
                <div>
                    <form onSubmit={this.onEnterText.bind(this)}>
                        <TextField
                            value={this.state.input}
                            error={this.state.invalidInput}
                            onChange={this.onChangeText.bind(this)}
                        >
                            Test{" "}
                        </TextField>
                        <Button
                            onClick={this.onEnterText.bind(this)}
                            onKeyPress={ev => {
                                    if (ev.key === "Enter") {
                                        this.onEnterText.bind(this);
                                        ev.preventDefault();
                                    }
                            }}
                        >
                            Check
                        </Button>
                    </form>
                </div>
                <br />
                <div>
                    {this.state.hits.length >= this.state.numHitsRequired
                     ? "You have options! Scroll down below."
                     : "You have " + this.state.hits.length + " hits."}
                </div>
                <br />

                <br />
                <hr />
                <div className="results">
                    <Grid container spacing={8}>
                        <Grid item xs={12} md={6}>
                            <ItemList subheader="Hits" items={this.state.hits} icon={<DoneIcon />}></ItemList>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <ItemList subheader="Attempts" items={this.state.attempts} icon={<SearchIcon />}> </ItemList>
                        </Grid>
                    </Grid>
                </div>
                <hr />
                <div className="options>">
                    <ShowOptionList
                        handleClick={this.props.handleClick}
                        numHitsRequired={this.state.numHitsRequired}
                        options={this.state.options}
                        numHits={this.state.hits.length}
                    />
                </div>
            </page>
        </div>
);
  }
}

class App extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            caseArray: [0, 1, 2, 3],
            dones: [false, false, false, false],
            codewords: ["", "", "", ""],
            cases: [case0, case1, case2, case3]
        }
        this.notifyDone = () => toast.info("Scroll up and go to the next tab/case or if this is the last case, post your codewords in the chat!");
        this.makeTab = this.makeTab.bind(this)
        this.makeFrame = this.makeFrame.bind(this)
        this.handleClicks = [this.handleClick.bind(this, 0),
                             this.handleClick.bind(this, 1),
                             this.handleClick.bind(this, 2),
                             this.handleClick.bind(this, 3)
        ]
    }


    handleClick(num, word) {
        console.log(num)
        this.setState({
            dones: update(this.state.dones, {[num]: {$set: 'true'}}),
            codewords: update(this.state.codewords, {[num]: {$set: word}})
        })
        this.notifyDone()
    }

    makeTab(num) {
        return (
            <Tab key={num.toString()}>
                {this.state.dones[num]
                 ? this.state.codewords[num].toUpperCase()
                 : this.state.cases[num].stationTitle}
            </Tab>
        )
    }

    makeFrame(num) {
        return (
            <TabPanel key={num.toString()}>
                <MainFrame
                    case={this.state.cases[num]}
                    stationNo={num + 1}
                    handleClick={this.handleClicks[num]}
                />
            </TabPanel>
        )
    }

    render() {
    return (
        <div className="App">
            <ToastContainer autoClose={8000} />
            <Tabs>
                <TabList>
                    {this.state.caseArray.map(a => this.makeTab(a))}
                </TabList>

                {this.state.caseArray.map(a => this.makeFrame(a))}

            </Tabs>
        </div>
    );
    }
}


const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
