import React, { Component } from 'react';
import './App.css';
import './index.css';
import * as Papa from 'papaparse';
// import {List, ListItem} from '@rmwc/list';
// import { Jumbotron, ListGroup, ListGroupItem, Well} from 'react-bootstrap';
// import {Grid, Row, Col} from 'react-bootstrap';
// import { Typography } from '@rmwc/typography';
// import { Card } from '@rmwc/card';
// import { Grid, GridCell, GridInner} from '@rmwc/grid';

// import '@material/card/dist/mdc.card.css';
// import '@material/list/dist/mdc.list.css';
// import '@material/layout-grid/dist/mdc.layout-grid.css';
import 'flexboxgrid/dist/flexboxgrid.css';
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      formatted: {},
      loaded: false,
      tableIndex: 1
    }
    this.updateData = this.updateData.bind(this);

  }


  componentWillMount() {

    // Your parse code, but not seperated in a function
    // var csvFilePath = require("./datasets/Data.csv");
    const file = 'https://gitlab.com/wnordmann/hhhcwinner/raw/master/SampleWinners.csv';
    // const file = 'https://gitlab.com/wnordmann/hhhcwinner/raw/master/src/winner.csv';
    Papa.parse(file, {
      header: true,
      download: true,
      skipEmptyLines: true,
      // Here this is also available. So we can call our custom class method
      complete: this.updateData
    });
  }

  updateData(result) {
    const data = result.data;
    const formatted = {};
    for(let i = 0; i < data.length; i++) {
      if(!formatted[`${data[i]['Table Number']}`]) {
        formatted[`${data[i]['Table Number']}`] = [];
      }
      formatted[`${data[i]['Table Number']}`].push(data[i]);
    }
    console.log(formatted);
    this.setState(
      { data: data,
        formatted: formatted,
        loaded: true
      });
  }
  nextPage() {
    this.setState({tableIndex: this.state.tableIndex + 1});
  }
  prevPage() {
    this.setState({tableIndex: this.state.tableIndex - 1});
  }
  calculatePlace(place){
    if(place === '1') {
      return "First Place";
    } else if(place === '2') {
      return "Second Place";
    } else if(place === '3') {
      return "Thrid Place";
    }

  }
  entryCard(entry){
//     <div className="row">
//     <div className="col-xs-12
//                 col-sm-8
//                 col-md-6
//                 col-lg-4">
//         <div className="box">Responsive</div>
//     </div>
// </div>
      return(
        <div className="row entry" key={entry['Place']}>
          <div className="col-lg-3"><h1>{this.calculatePlace(entry['Place'])}</h1></div>
          <div className="col-lg-8">
              <div className="row"><div className="col-lg-7"><h2>{entry['First Name']} {entry['Last Name']}</h2></div><div className="col-lg-3 col-lg-offset-1" ><h5>{entry['Co Brewer'].length > 0 ? ` with ${entry['Co Brewer']}` : ''}</h5></div></div>
              <div className="row"><h3>Category {entry['Category']}{entry['Style']} : {entry['Style Name']}</h3></div>
              <div className="row"><h3>Club: {entry['Club']} Hometown: {entry['City']} {entry['State/Province']}</h3></div>
          </div>
        </div>
    )  
  }  

  formattedPage(data){
    const list = [];
    for(let i =0; i < data.length; i++) {
      // list.push(<ListItem twoLine key={i} text={this.calculatePlace(data[i]['Place'])} >{data[i]['First Name']} {data[i]['Last Name']} ({data[i]['Club']} {data[i]['City']} {data[i]['State/Province']})- {data[i]['Category']} {data[i]['Style']} : {data[i]['Style Name']} {data[i]['Entry Name']} </ListItem>);
      list.push(this.entryCard(data[i]));

    }
    return (
      <div>
          <h1>Table {data[0]['Table Number']} - {data[0]['Table Name']}</h1>
          <div className='container'>
            {list}
          </div>
      </div>)
  }
  render() {
    return (
      <div className="App">
        {this.state.loaded && this.formattedPage(this.state.formatted[this.state.tableIndex])}
        <button onClick={() => {this.prevPage()}}>Previous</button>
        <button onClick={() => {this.nextPage()}}>Next</button>
      </div>
    );
  }
}
export default App;
