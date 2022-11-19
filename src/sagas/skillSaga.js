import { takeLatest, put, spawn, debounce, retry } from 'redux-saga/effects';
//import { searchSkillsRequest, searchSkillsSuccess, searchSkillsFailure } from '../actions/actionCreators';
import { changeSearchField, searchRequest, searchSuccess, searchFailure } from '../features/skills/skillSlice';
//import { CHANGE_SEARCH_FIELD, SEARCH_SKILLS_REQUEST } from '../actions/actionTypes';
import { searchSkills } from '../api/skillAPI';

function filterChangeSearchAction({type, payload}) {
  console.log('filterChangeSearchAction', type, typeof(type), payload);
  return type === changeSearchField.toString() && payload.trim() !== ''
};

// worker
function* handleChangeSearchSaga(action) {
  console.log('handleChangeSearchSaga', action);
  yield put(searchRequest(action.payload));
};

// watcher
function* watchChangeSearchSaga() {
  yield debounce(500, filterChangeSearchAction, handleChangeSearchSaga);
};

// worker
function* handleSearchSkillsSaga(action) {
  console.log('handleSearchSkillsSaga', action);
  try {
    const retryCount = 0;
    const retryDelay = 1000; // ms
    const data = yield retry(retryCount, retryDelay, searchSkills, action.payload);
    yield put(searchSuccess(data));
  } catch (e) {
    yield put(searchFailure(e.message));
  };
};

// watcher
function* watchSearchSkillsSaga() {
    yield takeLatest(searchRequest, handleSearchSkillsSaga);
};

export default function* saga() {
    yield spawn(watchChangeSearchSaga);
    yield spawn(watchSearchSkillsSaga)
};