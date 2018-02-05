import React from 'react';

import {connect} from 'react-redux';
import {setSelectedFeatures} from './actions';

class MemberList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      MemberId: '',
      FeePaid: '5',
      BroughtBeer: '0',
      AttendedMeeting: '0',
      MonthNum: '0',
      YearNum: '0',
      FirstName: '',
      LastName: '',
      selected: false,
      filterData: [],
    };

    this.checkIn = this.checkIn.bind(this);
  }

  componentWillMount(){
    const url = 'http://localhost:3000/api/v1/users';
    fetch(url)
      .then(response => response.json())
      .then((members) => {
        this.props.dispatch(setSelectedFeatures(members));
      });
  }
  handleMemberIdChange = (event) => {
    this.setState({MemberId: event.target.value});
  }
  handleLastNameChange = (event) => {
    this.setState({LastName: event.target.value});
  }
  handleFirstNameChange = (event) => {
    this.setState({FirstName: event.target.value});
  }
  // shouldComponentUpdate(nextProps, nextState){
  //   let filter = {
  //     FirstName: nextState.FirstName,
  //     LastName: nextState.LastName,
  //     MemberId: nextState.MemberId
  //   }
  //   const filterData = this.filterMemberData(filter);
  //   if(nextState.filterData.length !== filterData.length){
  //     this.setState({filterData});
  //     return true;
  //   }
  //   return false;
  // }
  checkIn(){
    const url = 'http://localhost:3000/api/v1/checkin';
    const today = new Date();
    const data = {
      MemberId: this.state.MemberId,
      FeePaid: this.state.FeePaid,
      BroughtBeer: this.state.BroughtBeer,
      AttendedMeeting: '1',
      MonthNum: today.getMonth() + 1,
      YearNum: today.getFullYear(),
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
  }
  filterMemberData(filter){
    const members = this.props.members.members;
    // const filter = this.state;
    if(members.length > 0){
      const filterData = [];

      // Set up regular expressions for each key value
      // Check aginst values entered in the form and put into state
      const firstNameRegEx = new RegExp(filter.FirstName, "i");
      const lastNameRegEx = new RegExp(filter.LastName, "i");
      const memberIdNameRegEx = new RegExp(filter.MemberId.toString());


      for (let i = 0, ii = members.length; i < ii; i++) {
        // Get important memeber info from db
        const firstName = members[i].first_name;
        const lastName = members[i].last_name;
        const memberId = members[i].MemberID.toString();

        // Set up regular expressions for each key value
        // Check aginst values entered in the form and put into state
        // const firstNameRegEx = new RegExp(filter.FirstName, "i");
        // const lastNameRegEx = new RegExp(filter.LastName, "i");
        // const memberIdNameRegEx = new RegExp(filter.MemberId.toString());

        // Check regular expressions, only add data if the regex is good
        if(firstName.match(firstNameRegEx) && lastName.match(lastNameRegEx) && memberId.match(memberIdNameRegEx)){
          // build the table data
          // data.push (<tr key={memberId}><td>{memberId}</td><td>{firstName}</td><td>{lastName}</td></tr>);
          filterData.push ({memberId, firstName, lastName});
        }
      }
      // if(filterData.length === 1){
      //   this.setState({selected: true});
      // } else {
      //   this.setState({selected: false});
      // }
      return filterData;
    }
    return [];
  }
  buildTable(){
    let filter = {
      FirstName: this.state.FirstName,
      LastName: this.state.LastName,
      MemberId: this.state.MemberId
    }
    const members = this.filterMemberData(filter);
    // const members = this.state.filterData;
    const data = [];
    if(members.length > 0){

      for (let i = 0, ii = members.length; i < ii; i++) {
        data.push (<tr key={members[i].memberId}><td>{members[i].memberId}</td><td>{members[i].firstName}</td><td>{members[i].lastName}</td></tr>);
      }
      return (
        <table>
        <tbody>
          {data}
        </tbody>
        </table>
      )
    }
    return false;
  }
  render() {
    const table = this.buildTable();
    return (
      <div>
        <div>
          <label>Member Id</label>
          <input
            type="number"
            min="0"
            max="1000"
            value={this.state.MemberId}
            onChange={(event) => {this.handleMemberIdChange(event)}}
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            value={this.state.lastName}
            onChange={(event) => {this.handleLastNameChange(event)}} />
        </div>
        <div>
          <label>First</label>
          <input
            type="text"
            value={this.state.firstName}
            onChange={(event) => {this.handleFirstNameChange(event)}} />
        </div>

        <button onClick={this.postTest}>Post Test</button>
        {table}

      </div>
    );
  }
}

function stateToPropsFn(state) {
  return {
    members: state.members,
  };
}

export default connect(stateToPropsFn)(MemberList);
