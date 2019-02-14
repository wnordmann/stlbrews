import React from 'react';

import {connect} from 'react-redux';
import {setSelectedFeatures} from './actions';
import MemberList from './components/member-list';

class OldMemberList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      MemberId: '',
      AttendedMeeting: '0',
      MonthNum: '0',
      YearNum: '0',
      FirstName: '',
      LastName: '',
      selected: false,
      filterData: [],
    };

    this.checkIn = this.checkIn.bind(this);
    this.friendship = this.friendship.bind(this);
  }

  componentWillMount(){
    const url = 'http://localhost:3000/api/v1/users';
    fetch(url)
      .then(response => response.json())
      .then((members) => {
        this.props.dispatch(setSelectedFeatures(members));
      }).catch(error => console.error('Error:', error));

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
  resetState() {
    this.setState({
      MemberId: '',
      AttendedMeeting: '0',
      MonthNum: '0',
      YearNum: '0',
      FirstName: '',
      LastName: '',
      selected: false,
      filterData: [],
    });
  }
  checkIn(memberId, feePaid=5, broughtBeer=0){
    const url = 'http://localhost:3000/api/v1/checkin';
    const today = new Date();
    const data = {
      MemberId: memberId,
      FeePaid: feePaid,
      BroughtBeer: broughtBeer,
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
    .then(response => this.resetState());
  }
  friendship(memberId, friendship, friendshipLead, pulledpork){
    const url = 'http://localhost:3000/api/v1/friendship';
    const data = {
      MemberId: memberId,
      friendship: friendship,
      friendshipLead: friendshipLead,
      pulledpork: pulledpork,
      reg_date: Date.now()
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => this.resetState());
  }
  duesPaid(memberId){
    const url = 'http://localhost:3000/api/v1/duespaid';
    const data = {
      MemberId: memberId,
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => this.resetState());
  }
  filterMemberData(filter){
    const members = this.props.members.members;

    if (filter.FirstName === '' && filter.LastName === '' && filter.MemberId === ''){
      return [];
    } else if (members.length > 0){
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
        const email = members[i].Email;
        const paid = members[i]['2018_Dues_Paid'];

        // Set up regular expressions for each key value
        // Check aginst values entered in the form and put into state

        // Check regular expressions, only add data if the regex is good
        if(firstName.match(firstNameRegEx) && lastName.match(lastNameRegEx) && memberId.match(memberIdNameRegEx)){
          // build the table data
          filterData.push ({memberId, firstName, lastName, email, paid});
        }
      }
      return filterData;
    }
    return [];
  }
  render() {
    let filter = {
      FirstName: this.state.FirstName,
      LastName: this.state.LastName,
      MemberId: this.state.MemberId
    }
    const members = this.filterMemberData(filter);
    let noBeerButton, withBeerButton, friendship, friendshipLead, pulledpork, paid;
    if (members.length === 1) {
      noBeerButton = (<button onClick={() => {this.checkIn(members[0].memberId, 5, 0)} }>Paid Meeting Fee</button>);
      withBeerButton = (<button onClick={() => {this.checkIn(members[0].memberId, 0 ,1)} }>Brought Beer</button>);
      friendship = (<button onClick={() => {this.friendship(members[0].memberId, 1 ,0, 0)} }>Fiendship</button>);
      friendshipLead = (<button onClick={() => {this.friendship(members[0].memberId, 1 ,1, 0)} }>Friendship Lead</button>);
      pulledpork = (<button onClick={() => {this.friendship(members[0].memberId, 0 ,0 , 1)} }>Pulled Pork</button>);
      paid = (<button onClick={() => {this.duesPaid(members[0].memberId)} }>Dues Paid</button>);
    }
    const current = this.state.MemberId;
    document.onkeypress = (e) => {
      e = e || window.event;
      const digit = e.key;
      if(e.target.nodeName === 'BODY' && digit.match(/[0-9]/i)){
        this.setState({MemberId: current + digit});
      }
    };
    return (
      <div>
        <div>
          <label>Member Id</label>
          <input
            className='memberId'
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
            value={this.state.FirstName}
            onChange={(event) => {this.handleFirstNameChange(event)}} />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            value={this.state.LastName}
            onChange={(event) => {this.handleLastNameChange(event)}} />
        </div>
          <MemberList list={members}/>
          {noBeerButton}
          {withBeerButton}
          {paid}
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
