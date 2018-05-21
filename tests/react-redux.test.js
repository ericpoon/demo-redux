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

describe('re-renders correctly', () => {
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

    const mounted = mount(app);
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
    mounted.unmount();
  });

  it('re-renders only when related state has been updated', () => {
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

    const mounted = mount(app);
    expect(mockFn).toHaveBeenLastCalledWith('Title');

    store.dispatch({ type: 'CHANGE_TITLE', title: 'new title' });
    expect(mockFn).toHaveBeenLastCalledWith('new title');
    expect(mockFn).toHaveBeenCalledTimes(2);

    store.dispatch({ type: 'CHANGE_DESCRIPTION', description: 'new description' });
    expect(mockFn).toHaveBeenCalledTimes(2); // no re-rendering
    mounted.unmount();
  });
});

describe('handles props, state, dispatch correctly', () => {
  let mockStore;
  let spy;
  beforeEach(() => {
    const identityReducer = (state, action) => action.newState;
    mockStore = createStore(identityReducer);
    spy = jest.fn();

    mount(<Provider store={mockStore} />);
  });

  it('passes props from connected component to original component', () => {
    class Comp extends Component {
      componentWillMount() {
        spy(this.props.propPassedToConnectedComp);
      }

      render() {
        return <div />;
      }
    }

    const ConnectedComp = connect()(Comp);
    const mounted = mount(<ConnectedComp propPassedToConnectedComp={'foo'} />);

    expect(spy).toHaveBeenLastCalledWith('foo');
    mounted.unmount();
  });

  it('maps state to props correctly', () => {
    class Comp extends Component {
      componentWillMount() {
        spy(this.props.propMappedFromState);
      }

      render() {
        return <div />;
      }
    }

    const ConnectedComp = connect(state => ({ propMappedFromState: state }))(Comp);
    mockStore.dispatch({ type: '', newState: 'foo' });
    const mounted = mount(<ConnectedComp />);

    expect(spy).toHaveBeenLastCalledWith('foo');

    mounted.unmount();
  });

  describe('it maps dispatch to props', () => {
    let Comp;
    beforeEach(() => {
      Comp = class extends Component {
        componentWillMount() {
          this.props.doIt();
        }

        render() {
          return <div />;
        }
      };
    });
    it('maps dispatch to props - mapDispatchToProps as an object', () => {
      const mockFn = jest.fn(() => ({ type: '' }));
      const ConnectedComp = connect(undefined, { doIt: mockFn })(Comp);
      const mounted = mount(<ConnectedComp />);
      expect(mockFn).toHaveBeenCalledTimes(1);

      mounted.unmount();
    });

    it('maps dispatch to props - mapDispatchToProps as a function', () => {
      const mockFn = jest.fn(() => ({ type: '' }));
      const ConnectedComp = connect(undefined, (dispatch) => ({ doIt: (...args) => dispatch(mockFn(...args)) }))(Comp);
      const mounted = mount(<ConnectedComp />);
      expect(mockFn).toHaveBeenCalledTimes(1);

      mounted.unmount();
    });

  });

});
