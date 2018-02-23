import React from 'react';

import {connect} from 'react-redux';
import {setSelectedFeatures} from './actions';
import MemberList from './components/member-list';

class OldMemberList extends React.Component {
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

        // Check regular expressions, only add data if the regex is good
        if(firstName.match(firstNameRegEx) && lastName.match(lastNameRegEx) && memberId.match(memberIdNameRegEx)){
          // build the table data
          filterData.push ({memberId, firstName, lastName});
        }
      }
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
    const data = [];

    if(this.props.members.members.length === members.length){
      return false;
    } else if(members.length > 0){
      let postButton;
      if(members.length === 1){
        this.setState({
          FirstName: members[0].firstName,
          LastName: members[0].lastName,
          MemberId: members[0].memberId,
        });

        postButton = (<button onClick={this.postTest}>Post Test</button>);
      }
      return (<MemberList list={members}/>)
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
          <label>First</label>
          <input
            type="text"
            value={this.state.firstName}
            onChange={(event) => {this.handleFirstNameChange(event)}} />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            value={this.state.lastName}
            onChange={(event) => {this.handleLastNameChange(event)}} />
        </div>
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

export default connect(stateToPropsFn)(OldMemberList);
