import {MEMBERACTIONS} from './action-types';

const defaultState = {
  members: [],
  firstNames: [],
  lastNames: [],
  memberIds: [],
};

function setMemberList(state, members) {
  const memberIds = members.response.map((m) => {return { value: m.MemberID, label: m.MemberID }});
  const firstNames = members.response.map((m) => {return { value: m.MemberID, label: m.first_name }});
  const lastNames = members.response.map((m) => {return { value: m.MemberID, label: m.last_name }});

  return Object.assign({}, state, {
    members: members.response,
    firstNames,
    lastNames,
    memberIds,
  });
}



export default function FeatureReducer(state = defaultState, action) {
  switch (action.type) {
    case MEMBERACTIONS.SET_MEMBERS:
      return setMemberList(state, action.members);
    default:
      return state;
  }
}
