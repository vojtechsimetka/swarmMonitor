import React from "react";
import Container from "react-bootstrap/Container";

import SwarmConnectionsProvider from "providers/SwarmConnectionsProvider";
import Header from "components/Header";
import ConnectionsTab from "components/ConnectionsTab";

const App: React.FC = () => {
  return (
    <SwarmConnectionsProvider.Provider>
      <Header />
      <Container style={{ marginTop: 50 }}>
        <ConnectionsTab />
        {/*<Example />*/}
        <div style={{ flexGrow: 1 }} />
      </Container>
    </SwarmConnectionsProvider.Provider>
  );
};

export default App;
