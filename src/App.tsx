import React from "react";
import Container from "react-bootstrap/Container";

import Web3Provider from "providers/Web3Provider";
import Example from "views/Example";
import NodeDetails from "components/NodeDetails";

const App: React.FC = () => {
  return (
    <Web3Provider.Provider>
      <Container>
        <NodeDetails />
        {/*<Example />*/}
        <div style={{ flexGrow: 1 }} />
      </Container>
    </Web3Provider.Provider>
  );
};

export default App;
