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
        _globalStore.dispatch({ type: '@@INIT' }); // this loads inital state set in reducer
        const props = mapStateToProps(_globalStore.getState());
        const newKeys = Object.keys(props);
        newKeys.forEach((key) => {
          this.state[key] = props[key];
        });

        _globalStore.subscribe(() => {
          const props = mapStateToProps(_globalStore.getState());
          const newKeys = Object.keys(props);
          newKeys.forEach((key) => {
            if (this.state[key] !== props[key]) { // shallow comparison
              this.setState({ [key]: props[key] });
            }
          })
        });
      }

      render() {
        return <Component {...Component.props} {...this.state} />;
      }
    }

    return Connected;
  };
}
