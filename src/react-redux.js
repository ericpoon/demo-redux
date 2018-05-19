import React from 'react';

let _globalStore;

export const Provider = ({ store, children }) => {
  _globalStore = store;
  return <div>{children}</div>;
};

export function connect(mapStateToProps, mapDispatchToProps) {
  return function (Component) {
    class Connected extends React.Component {
      constructor() {
        super();

        this.state = {};
        _globalStore.dispatch({ type: '@@INIT' }); // this loads initial state set in reducer

        const props = mapStateToProps(_globalStore.getState());
        const propKeys = Object.keys(props);
        propKeys.forEach(key => {
          this.state[key] = props[key];
        });

        if (typeof mapDispatchToProps === 'function') {
          const actions = mapDispatchToProps(_globalStore.dispatch);
          const actionKeys = Object.keys(actions);
          actionKeys.forEach(key => {
            const action = actions[key];
            if (typeof actions[key] === 'function') {
              this.state[key] = action;
            }
          });
        } else if (typeof mapDispatchToProps === 'object') {
          const actions = mapDispatchToProps;
          const actionKeys = Object.keys(actions);
          actionKeys.forEach(key => {
            const action = actions[key];
            if (typeof actions[key] === 'function') {
              this.state[key] = (...args) => _globalStore.dispatch(action(...args));
            }
          });
        }

        _globalStore.subscribe(() => {
          const props = mapStateToProps(_globalStore.getState());
          const newKeys = Object.keys(props);
          newKeys.forEach(key => {
            if (this.state[key] !== props[key]) { // shallow comparison
              this.setState({ [key]: props[key] });
            }
          });
        });
      }

      render() {
        return <Component {...this.props} {...this.state} />;
      }
    }

    return Connected;
  };
}
