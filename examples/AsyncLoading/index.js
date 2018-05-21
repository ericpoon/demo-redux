import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { Provider, connect } from '../../src/react-redux';
import { createStore } from '../../src/redux';
import thunk from '../../src/enhancers/redux-thunk';

class Student extends Component {
  render() {
    const { loading, student, loadStudentInfo } = this.props;
    return (
      <div>
        <h2>Student Information</h2>

        <button onClick={loadStudentInfo}>Load</button>

        {loading && <p>Loading...</p>}
        {student && <p>{JSON.stringify(student)}</p>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.loading,
  student: state.student,
});

const loadStudentInfo = () => {
  const student = {
    firstName: 'John',
    lastName: 'Smith',
    id: '12345678',
    major: 'Software Engineering',
    year: 3,
  };

  return (dispatch) => {
    dispatch({ type: 'STUDENT_INFO_LOADING_START' });

    setTimeout(() => {
      dispatch({
        type: 'STUDENT_INFO_LOADING_SUCCESS',
        student: student,
      });
    }, 2000);
  };
};

const ConnectedStudent = connect(mapStateToProps, { loadStudentInfo })(Student);

function countReducer(state = { loading: false, student: null }, action) {
  switch (action.type) {
    case 'STUDENT_INFO_LOADING_START':
      return { loading: true, student: null };
    case 'STUDENT_INFO_LOADING_SUCCESS':
      return { loading: false, student: action.student };
    default:
      return state;
  }
}

const store = createStore(countReducer, thunk);

const main = (
  <Provider store={store}>
    <ConnectedStudent />
  </Provider>
);

const app = document.getElementById('async-loading-app');
if (app) ReactDom.render(main, app);
