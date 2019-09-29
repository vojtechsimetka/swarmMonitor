import React from "react";
import Button from "react-bootstrap/Button";

import SwarmConnectionsProvider from "providers/SwarmConnectionsProvider";
import NodeDetails from "components/NodeDetails";
import SwarmConnection, { ESTATUS } from "models/SwarmConnection";
import AddConnectionButton from "components/AddConnectionButton";

interface IConnectionTabProps {
  connections: Array<SwarmConnection>;
  removeConnection: (index: number) => void;
}
interface IConnectionTabState {
  activeTab: number;
}

class ConnectionTab extends React.Component<
  IConnectionTabProps,
  IConnectionTabState
> {
  constructor(props: IConnectionTabProps) {
    super(props);
    this.state = {
      activeTab: 0
    };
  }

  render() {
    const { activeTab } = this.state;
    const { connections } = this.props;
    if (connections.length === 0)
      return (
        <p style={{ textAlign: "center" }}>
          You have no connections. <br />
          <AddConnectionButton size="sm" />
        </p>
      );
    const connectionNavComps = connections.map((c, i) => (
      <li className="nav-item" key={i}>
        <button
          className={`nav-link ${activeTab === i && "active"}`}
          onClick={() => this.setState({ activeTab: i })}
        >
          {c.label}
        </button>
      </li>
    ));
    const activeConnection =
      connections[Math.min(activeTab, connections.length - 1)];
    return (
      <div>
        {connections.length > 1 && (
          <ul className="nav nav-tabs">{connectionNavComps}</ul>
        )}
        {activeConnection.status === ESTATUS.ACTIVE && (
          <NodeDetails
            peers={activeConnection.peers}
            node={activeConnection.node}
            updatedAt={activeConnection.updatedAt}
            websocketConnection={activeConnection.connectionString}
            removeConnection={() => this.props.removeConnection(activeTab)}
          />
        )}
        {activeConnection.status === ESTATUS.CLOSED && (
          <p>
            Connection to {activeConnection.connectionString} has not been
            initiated yet or has been terminated. Please make sure swarm is
            running, it has enabled websockets and cors is set correctly. If yes
            pleas try and refresh the page.
            <br />
            {activeConnection.message}
            <br />
            <Button
              variant="danger"
              size="sm"
              onClick={() => this.props.removeConnection(activeTab)}
            >
              Remove
            </Button>
          </p>
        )}
      </div>
    );
  }
}

export default () => (
  <SwarmConnectionsProvider.Consumer>
    {({ state: { connections }, actions: { removeConnection } }) => (
      <ConnectionTab
        connections={connections}
        removeConnection={removeConnection}
      />
    )}
  </SwarmConnectionsProvider.Consumer>
);
