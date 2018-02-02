import {MEMBERACTIONS} from './action-types';

export function setSelectedFeatures(members) {
  return {
    type: MEMBERACTIONS.SET_MEMBERS,
    members,
  };
}
