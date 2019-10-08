import React, { Component, createContext } from "react";
import SwarmConnection from "models/SwarmConnection";

export interface ISwarmConnection {
  actions: {
    addConnection: (connectionString: string, label?: string) => void;
    removeConnection: (index: number) => void;
  };
  state: {
    connections: Array<SwarmConnection>;
  };
}

const { Provider, Consumer } = createContext<ISwarmConnection>({
  actions: {
    addConnection: () => {},
    removeConnection: () => {}
  },
  state: {
    connections: []
  }
});

interface ISwarmConnectionProps {}
interface ISwarmConnectionState {
  connections: Array<SwarmConnection>;
}

class SwarmConnectionProvider extends Component<
  ISwarmConnectionProps,
  ISwarmConnectionState
> {
  constructor(props: object) {
    super(props);

    this.state = {
      connections: []
    };

    this.addConnection = this.addConnection.bind(this);
    this.removeConnection = this.removeConnection.bind(this);
    this.saveConnections = this.saveConnections.bind(this);
  }
  componentDidMount() {
    const connections = localStorage.getItem("connections");
    if (connections) {
      const cs: Array<{ label: string; connectionString: string }> = JSON.parse(
        connections
      );
      cs.forEach(c => this.addConnection(c.connectionString, c.label));
    } else {
      try {
        this.addConnection("ws://127.0.0.1:8546", "Local");
      } catch (e) {}
      try {
        this.addConnection("ws://192.168.55.102:8546", "Bootnode");
      } catch (e) {}
    }
  }
  componentWillUnmount() {
    this.state.connections.forEach(c => c.close());
  }

  addConnection(connectionString: string, label?: string) {
    const { connections } = this.state;
    connections.push(
      new SwarmConnection(
        connectionString,
        label || connectionString,
        this.forceUpdate.bind(this)
      )
    );
    this.saveConnections();
    this.setState({ connections });
  }

  removeConnection(index: number) {
    let { connections } = this.state;

    console.log(1, index);
    if (index >= 0 && index < connections.length) {
      connections[index].close();
      const conns: Array<SwarmConnection> = [];
      connections.forEach((c, i) => {
        if (i !== index) conns.push(c);
      });
      this.saveConnections();
      this.setState({ connections: conns });
    }
  }
  saveConnections() {
    const { connections } = this.state;
    if (localStorage) {
      localStorage.setItem(
        "connections",
        JSON.stringify(
          connections.map(c => ({
            label: c.label,
            connectionString: c.connectionString
          }))
        )
      );
    }
  }

  render() {
    const { connections } = this.state;
    const { addConnection, removeConnection } = this;
    return (
      <Provider
        value={{
          actions: {
            addConnection,
            removeConnection
          },
          state: { connections }
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export default { Consumer, Provider: SwarmConnectionProvider };
