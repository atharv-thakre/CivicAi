import React, { createContext, useContext, useReducer } from 'react';
import { mockComplaint } from '../mockData';

const initialState = {
  complaints: [],
  activeComplaintId: null,
  user: null,
  loading: false,
};

const AppContext = createContext(undefined);

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_COMPLAINTS':
      return { ...state, complaints: action.payload };
    case 'SET_ACTIVE_COMPLAINT':
      return { ...state, activeComplaintId: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'UPDATE_COMPLAINT_STATUS':
      return {
        ...state,
        complaints: state.complaints.map(c => 
          c.id === action.payload.id ? { ...c, status: action.payload.status } : c
        )
      };
    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
