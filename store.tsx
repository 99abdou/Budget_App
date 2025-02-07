import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk }from 'redux-thunk'; // Correction de l'import
import authReducer from './Actions/authSlice';
import budgetReducer from './Actions/Budget/budgetSlice';
import userReducer from './Actions/userReducer';
import transactionReducer from './Actions/transactionReducer';


// Combinaison des reducers
const rootReducer = combineReducers({
  auth: authReducer, // Reducer pour l'authentification
  budget: budgetReducer, // Reducer pour la gestion du budget
  user: userReducer,
    transactions: transactionReducer,
});

// Type pour RootState
// export type RootState = ReturnType<typeof rootReducer>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Création du store avec thunk comme middleware
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

