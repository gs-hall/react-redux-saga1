import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import skillReducer from '../features/skills/skillSlice';
import saga from '../sagas/skillSaga';

const sagaMiddleware = createSagaMiddleware();


export const store = configureStore({
  reducer: {
    skills: skillReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

sagaMiddleware.run(saga);