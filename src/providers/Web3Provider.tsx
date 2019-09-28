import React, { Component, createContext } from "react";
import Cheque, { IChequeParams } from "models/Cheque";
import Peer from "models/Peer";
import Node from "models/Node";

export const PAYMENT_THRESHOLD = 1000000;

enum EREQUEST {
  BALANCES = "swap_balances",
  SENT_CHEQUES = "swap_sentCheques",
  RECEIVED_CHEQUES = "swap_receivedCheques"
}
const REQUESTS = [
  EREQUEST.BALANCES,
  EREQUEST.SENT_CHEQUES,
  EREQUEST.RECEIVED_CHEQUES
];

type Response<T> = {
  id: number;
  result: { [key: string]: T };
};

export interface IWeb3Provider {
  actions: {};
  state: {
    peers: Array<Peer>;
    updatedAt?: Date;
    node: Node;
  };
}

const { Provider, Consumer } = createContext<IWeb3Provider>({
  actions: {},
  state: {
    peers: [],
    node: new Node()
  }
});

interface IWeb3ProviderProps {}
interface IWeb3ProviderState {
  connection?: any;
  interval?: any;
  updatedAt?: Date;
  peers: Map<string, Peer>;
  node: {
    address: string;
    chequebookAddress: string;
    currentHoneyBalance: number;
    totalHoneySent: number;
    totalHoneyReceived: number;
    totalChequesSent: number;
    totalChequesReceived: number;
  };
}

class Web3Provider extends Component<IWeb3ProviderProps, IWeb3ProviderState> {
  constructor(props: object) {
    super(props);

    this.state = {
      peers: new Map(),
      node: new Node()
    };
    this.makeRequests = this.makeRequests.bind(this);
    this.parseResponse = this.parseResponse.bind(this);
    this.onClose = this.onClose.bind(this);
  }
  componentDidMount() {
    const connection = new WebSocket("ws://127.0.0.1:8546");

    connection.onopen = () => {
      this.makeRequests();
      this.setState({ interval: setInterval(this.makeRequests, 1000) });
    };
    connection.onclose = this.onClose;
    connection.onerror = this.onError;
    connection.onmessage = this.parseResponse;
    this.setState({ connection });
  }
  onClose() {
    const { interval } = this.state;
    if (interval) {
      clearInterval(interval);
      this.setState({ interval: undefined });
    }
  }
  onError(e) {
    console.log(e);
  }

  makeRequests() {
    const { connection } = this.state;
    REQUESTS.forEach((method, i) =>
      connection.send(JSON.stringify({ method, id: i }))
    );
  }

  parseResponse(e) {
    const data = JSON.parse(e.data);
    if (data) {
      const { peers, node } = this.state;
      switch (REQUESTS[data.id]) {
        case EREQUEST.BALANCES: {
          const d: Response<number> = JSON.parse(e.data);
          let b = 0;
          Object.entries(d.result).forEach(([key, balance]) => {
            const r = peers.get(key);
            if (r) r.balance = balance;
            else peers.set(key, new Peer({ balance, swarmAddress: key }));
            b += balance;
          });
          node.currentHoneyBalance = b;
          this.setState({ peers, node, updatedAt: new Date() });
          break;
        }
        case EREQUEST.SENT_CHEQUES:
          {
            const d: Response<IChequeParams> = JSON.parse(e.data);
            let totalHoneySent = 0;
            Object.entries(d.result).forEach(([key, cheque]) => {
              if (cheque) {
                const r = peers.get(key);
                if (r) {
                  if (r.sentCheque) {
                    r.sentCheque.cumulativePayout = cheque.CumulativePayout;
                    r.sentCheque.signature = cheque.Signature;
                    r.sentCheque.honey = cheque.Honey;
                  } else if (!r.sentCheque) {
                    r.sentCheque = new Cheque(cheque);
                  }
                } else
                  peers.set(
                    key,
                    new Peer({
                      swarmAddress: key,
                      sentCheque: new Cheque(cheque)
                    })
                  );
                totalHoneySent += cheque.CumulativePayout;
                node.chequebookAddress = cheque.Contract;
              }
            });
            node.totalHoneySent = totalHoneySent;
            node.totalChequesSent = Math.floor(
              totalHoneySent / PAYMENT_THRESHOLD
            );
            this.setState({ peers, updatedAt: new Date(), node });
          }
          break;
        case EREQUEST.RECEIVED_CHEQUES: {
          const d: Response<IChequeParams> = JSON.parse(e.data);
          let totalHoneyReceived = 0;
          Object.entries(d.result).forEach(([key, cheque]) => {
            if (cheque) {
              const r = peers.get(key);
              if (r) {
                if (r.receivedCheque) {
                  r.receivedCheque.cumulativePayout = cheque.CumulativePayout;
                  r.receivedCheque.signature = cheque.Signature;
                  r.receivedCheque.honey = cheque.Honey;
                } else if (!r.receivedCheque) {
                  r.receivedCheque = new Cheque(cheque);
                }
              } else
                peers.set(
                  key,
                  new Peer({
                    swarmAddress: key,
                    receivedCheque: new Cheque(cheque)
                  })
                );
              totalHoneyReceived += cheque.CumulativePayout;
              node.address = cheque.Beneficiary;
            }
          });
          node.totalHoneyReceived = totalHoneyReceived;
          node.totalChequesReceived = Math.floor(
            totalHoneyReceived / PAYMENT_THRESHOLD
          );
          this.setState({ peers, updatedAt: new Date(), node });
          break;
        }
      }
    }
  }

  render() {
    const { peers, updatedAt, node } = this.state;
    return (
      <Provider
        value={{
          actions: {},
          state: { updatedAt, peers: Array.from(peers.values()), node }
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export default { Consumer, Provider: Web3Provider };
