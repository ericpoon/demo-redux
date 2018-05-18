/** configure Enzyme **/
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
/** **************** **/

import React, { Component } from 'react';
import { mount } from 'enzyme';
import { createStore } from '../src/redux';
import { Provider, connect } from '../src/react-redux';
import { countReducer } from './fixture/countReducer';
import { taskReducer } from './fixture/taskReducer';

it('re-renders when state has been updated', () => {
  const mockFn = jest.fn();

  class Counter extends Component {
    render() {
      mockFn(this.props.count);
      return (
        <p>{this.props.count}</p>
      );
    }
  }

  const mapStateToProps = (state) => ({
    count: state,
  });

  const ConnectedCounter = connect(mapStateToProps)(Counter);

  const store = createStore(countReducer);
  const app = (
    <Provider store={store}>
      <ConnectedCounter />
    </Provider>
  );

  mount(app);
  expect(mockFn).toHaveBeenLastCalledWith(0);
  
  store.dispatch({ type: 'INCREMENT' });
  expect(mockFn).toHaveBeenLastCalledWith(1);

  store.dispatch({ type: 'INCREMENT' });
  expect(mockFn).toHaveBeenLastCalledWith(2);

  store.dispatch({ type: 'INCREMENT' });
  expect(mockFn).toHaveBeenLastCalledWith(3);

  store.dispatch({ type: 'DECREMENT' });
  expect(mockFn).toHaveBeenLastCalledWith(2);

  expect(mockFn).toHaveBeenCalledTimes(5);
});

it('re-renders when state has been updated', () => {
  const mockFn = jest.fn();

  class Task extends Component {
    render() {
      mockFn(this.props.title);
      return (
        <p>{this.props.title}</p>
      );
    }
  }

  const mapStateToProps = (state) => ({
    title: state.title,
  });

  const ConnectedTask = connect(mapStateToProps)(Task);

  const store = createStore(taskReducer);
  const app = (
    <Provider store={store}>
      <ConnectedTask />
    </Provider>
  );

  mount(app);
  expect(mockFn).toHaveBeenLastCalledWith('Title');
  
  store.dispatch({ type: 'CHANGE_TITLE', title: 'new title' });
  expect(mockFn).toHaveBeenLastCalledWith('new title');
  expect(mockFn).toHaveBeenCalledTimes(2);

  store.dispatch({ type: 'CHANGE_DESCRIPTION', description: 'new description' });
  expect(mockFn).toHaveBeenCalledTimes(2); // no re-rendering
});
