import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [
    {
        id: 1,
        msg: 'Please log in',
        alertType: 'success'
    }
]

export default function(state = initialState, action) {
const { type, payload } = action

    switch (type) {
        //Dispatch Set Alert
        case SET_ALERT:
            //Return Array New Alert
            return [...state, payload];
        case REMOVE_ALERT: 
            //Returns all Alerts except matching alert
            return state.filter(alert => alert.id !== payload);
        default:
            return state;
    }
}