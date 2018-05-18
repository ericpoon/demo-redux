import React from 'react';

let globalStore;

export const Provider = ({ store, children }) => {
  globalStore = store;
  return <div>{children}</div>;
};

export function connect(mapStateToProps, mapDispatchToProps) {
  return function (Component) {
    class HOC extends React.Component {
      state = { props: mapStateToProps(globalStore.getState()) };

      constructor() {
        super();
        globalStore.subscribe(() => {
          const props = mapStateToProps(globalStore.getState());
          this.setState({ props });
        });
      }

      render() {
        return <Component {...Component.props} {...this.state.props} />;
      }
    }

    return HOC;
  };
}
