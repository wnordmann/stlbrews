import React from 'react';

import {connect} from 'react-redux';
import {setSelectedFeatures} from './actions';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class MemberList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      MemberId: '000',
      FeePaid: '0',
      BroughtBeer: '0',
      AttendedMeeting: '0',
      MonthNum: '0',
      YearNum: '0',
      FirstName: 'first',
      LastName: 'last',
    };

    this.handleMemberIdChange = this.handleMemberIdChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleFeePaidChange = this.handleFeePaidChange.bind(this);
    this.handleBroughtBeerChange = this.handleBroughtBeerChange.bind(this);
    this.postTest = this.postTest.bind(this);
  }

  componentWillMount(){
    const url = 'http://localhost:3000/api/v1/users';
    fetch(url)
      .then(response => response.json())
      .then((members) => {
        this.props.dispatch(setSelectedFeatures(members));
      });
  }


  handleFeePaidChange(event) {
    this.setState({FeePaid: event.target.value});
  }
  handleBroughtBeerChange(event) {
    this.setState({BroughtBeer: event.target.value});
  }

  handleMemberIdChange = (selectedOption) => {
    this.setState({MemberId: selectedOption.label});
  }
  handleLastNameChange = (selectedOption) => {
    this.setState({
      LastName: selectedOption.label,
      MemberId: selectedOption.value
    });
  }
  handleFirstNameChange = (selectedOption) => {
    this.setState({
      FirstName: selectedOption.label,
      MemberId: selectedOption.value
    });
  }
  // handleChange = (selectedOption) => {
  //   // this.setState({ selectedOption });
  //   console.log(`Selected: ${selectedOption.label}`);
  // }
  postTest(){
    const url = 'http://localhost:3000/api/v1/checkin';
    const data = {
      MemberId: this.state.MemberId,
      FeePaid: this.state.FeePaid,
      BroughtBeer: this.state.BroughtBeer,
      AttendedMeeting: '1',
      MonthNum: '2',
      YearNum: '2018'
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
  buildTable(filter){
      const members = this.props.members.members;
      filter = {firstName:"Will"}
      //(["MemberID", "last_name", "first_name", "Address", "City", "State", "Zip", "HPhone", "MPhone", "Email", "2009 Dues Pd", "2010 Dues Pd", "2011 Dues Pd", "2012 Dues Pd", "2013 Dues Paid", "2014 Dues Paid", "2015 Dues Paid", "2016 Dues Paid", "2017 Dues Paid", "2018_Dues_Paid", "2016 Meeting Fees Paid", "2017 Meeting Fees Paid", "StatusCode", "BYO", "BYO 2013", "2010 HHHC Glass"]
      if(members.length > 0){
        const data = []
        for (let i = 0, ii = members.length; i < ii; i++) {
          const firstName = members[i].first_name;
          const lastName = members[i].last_name;
          const memberId = members[i].MemberID;
          const regEx = new RegExp(filter.firstName);
          if(firstName.match(regEx)){
            data.push (<tr key={memberId}><td>{memberId}</td><td>{firstName}</td><td>{lastName}</td></tr>);
          }
        }
        return (
          <table>
          <tbody>
            {data}
          </tbody>
          </table>
        )
      }
  }
  render() {
    const table = this.buildTable();
  const selecttor = (  <div>			<div className="section">
    				<h3 className="section-heading">First Name</h3>
            <Select
              name="First Name"
              value={this.state.FirstName}
              onChange={this.handleFirstNameChange}
              options={this.props.members.firstNames}
            />
          </div>
          <div className="section">
    				<h3 className="section-heading">Last Name</h3>
            <Select
              name="Last Name"
              value={this.state.LastName}
              onChange={this.handleLastNameChange}
              options={this.props.members.lastNames}
            />
          </div>
          <div className="section">
    				<h3 className="section-heading">Member Is</h3>
            <Select
              name="MemberId"
              value={this.state.MemberId}
              onChange={this.handleMemberIdChange}
              options={this.props.members.memberIds}
            />
          </div></div>);
    // const memberIds = this.props.members.members.response.map((m) => {return { value: m.MemberID, label: m.MemberID }});
    // const firstNames = this.props.members.members.response.map((m) => {return { value: m.first_name, label: m.first_name }})
    // const lastNames = this.props.members.members.response.map((m) => {return { value: m.last_name, label: m.last_name }})

    return (
      <div>
        <div>
          <label>Member Id</label>
          <input type="text" value={this.state.MemberId} onChange={this.handleMemberIdChange} />
        </div>
        <div>
          <label>FeePaid</label>
          <input type="text" value={this.state.FeePaid} onChange={this.handleFeePaidChange} />
        </div>
        <div>
          <label>BroughtBeer</label>
          <input type="text" value={this.state.BroughtBeer} onChange={this.handleBroughtBeerChange} />
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
