import React, { Component } from "react";
import ReactDOM from "react-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import DoneIcon from "@material-ui/icons/Done";
import SearchIcon from "@material-ui/icons/Search";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import update from "immutability-helper";
import { case0, case1, case2, case3 } from "./cases";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import "./styles.css";

class ItemList extends Component {
  constructor(props) {
    super(props);
    this.makeSubheader = this.makeSubheader.bind(this);
  }

  makeItem(item) {
    return (
      <ListItem key={item}>
        <ListItemIcon>{this.props.icon}</ListItemIcon>
        <ListItemText primary={item} />
      </ListItem>
    );
  }

  makeSubheader() {
    return <ListSubheader>{this.props.subheader}</ListSubheader>;
  }

  render() {
    return (
      <List dense subheader={this.makeSubheader()}>
        {this.props.items.map(this.makeItem.bind(this))}
      </List>
    );
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
      hits: {},
      attempts: [],
      input: "",
      invalidInput: true,
      stationTitle: this.props.case.stationTitle,
      stemText: this.props.case.stemText,
      patient: this.props.case.patient,
      options: this.props.case.options,
      numHitsRequired: this.props.case.numHitsRequired,
      stationNo: this.props.stationNo
    };
    this.notifyHits = () =>
      toast.info(
        "You've got enough hits! Scroll down to see the options and select one."
      );
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
      var all_hits = Object.keys(this.state.patient).filter(a =>
        a.includes(this.state.input.toLowerCase())
      );
      var current_keys = all_hits.filter(
        x => !Object.keys(this.state.hits).includes(x)
      );
      var current_hits = current_keys.reduce((obj, key) => {
        obj[key] = this.state.patient[key];
        return obj;
      }, {});
      console.log(all_hits);
      console.log(current_keys);
      console.log(current_hits);
      console.log(this.state.hits);
      if (Object.keys(current_hits).length > 0) {
        this.setState(prevState => ({
          hits: { ...prevState.hits, ...current_hits },
          attempts: [...prevState.attempts, this.state.input]
        }));
        if (
          Object.keys(this.state.hits).length ===
          this.state.numHitsRequired - 1
        ) {
          this.notifyHits();
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
                Input any HoPC questions (WWQQAA etc.), symptoms, risk factors,
                examination findings or investigations you would like to know.
              </li>
              <li>
                Where possible, use one word or the most succinct descriptor
                (e.g. "dyspnoea" instead of shortness of breath, "autonomic"
                instead of autonomic symptoms etc.).
              </li>
              <li>
                Your inputs need to be a minimum of <b> 4 characters</b>.
              </li>
              <li>
                Inputs should be medical terminology for a <b>specific </b>
                symptom, risk factor, finding or investigation.
              </li>
              <li>
                Once you have achieved <b>{this.state.numHitsRequired} hits</b>,
                you will be presented with options, and the corresponding
                codeword. You can still ask more questions if you'd like. Click your option and the tab name will change to the
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
            {Object.keys(this.state.hits).length >= this.state.numHitsRequired
              ? "You have options! Scroll down below."
              : "You have " + Object.keys(this.state.hits).length + " hits."}
          </div>
          <br />

          <br />
          <hr />
          <div className="results">
            <Grid container spacing={8}>
              <Grid item xs={12} sm={6}>
                <ItemList
                  subheader="Hits"
                  items={Object.values(this.state.hits)}
                  icon={<DoneIcon />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ItemList
                  subheader="Attempts"
                  items={this.state.attempts}
                  icon={<SearchIcon />}
                >
                  {" "}
                </ItemList>
              </Grid>
            </Grid>
          </div>
          <hr />
          <div className="options>">
            <ShowOptionList
              handleClick={this.props.handleClick}
              numHitsRequired={this.state.numHitsRequired}
              options={this.state.options}
              numHits={Object.keys(this.state.hits).length}
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
      cases: [case0, case1, case2, case3],
      dialogOpen: false
    };
    this.notifyDone = () =>
      toast.info(
        "Scroll up and go to the next tab/case or if this is the last case, post your codewords in the chat!"
      );
    this.makeTab = this.makeTab.bind(this);
    this.makeFrame = this.makeFrame.bind(this);
    this.handleClicks = [
      this.handleClick.bind(this, 0),
      this.handleClick.bind(this, 1),
      this.handleClick.bind(this, 2),
      this.handleClick.bind(this, 3)
    ];
    this.handleClose = this.handleClose.bind(this);
  }

  handleClick(num, word) {
    console.log(num);
    this.setState(
      {
        dones: update(this.state.dones, { [num]: { $set: "true" } }),
        codewords: update(this.state.codewords, { [num]: { $set: word } })
      },
      function() {
        if (!this.state.dones.includes(false)) {
          this.setState({ dialogOpen: true });
        }
      }
    );
    this.notifyDone();
  }

  makeTab(num) {
    return (
      <Tab key={num.toString()}>
        <span className={this.state.dones[num] ? "tab-done" : "tab-not-done"}>
          {this.state.dones[num]
            ? this.state.codewords[num].toUpperCase()
            : this.state.cases[num].stationTitle}
        </span>
      </Tab>
    );
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
    );
  }

  handleClose() {
    this.setState({ dialogOpen: false });
  }

  render() {
    return (
      <div className="App">
        <Dialog open={this.state.dialogOpen} onClose={this.handleClose}>
          <DialogContent>
            <DialogContentText>Your code phrase is</DialogContentText>
            <DialogTitle>{this.state.codewords.join(" ")}</DialogTitle>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <ToastContainer autoClose={5000} hideProgressBar />
        <Tabs forceRenderTabPanel={true}>
          <TabList>{this.state.caseArray.map(a => this.makeTab(a))}</TabList>

          {this.state.caseArray.map(a => this.makeFrame(a))}
        </Tabs>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
