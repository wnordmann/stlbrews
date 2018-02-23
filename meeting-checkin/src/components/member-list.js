import React from 'react';
import {connect} from 'react-redux';

export default class MemberList extends React.Component {
  render() {
    const members = this.props.list || [];
    const data = [];
    for (let i = 0, ii = members.length; i < ii; i++) {
      data.push (<li key={members[i].memberId}>{members[i].memberId} - {members[i].firstName} - {members[i].lastName}</li>);
    }
    return (
      <ul>
        {data}
      </ul>
    );
  }
}
