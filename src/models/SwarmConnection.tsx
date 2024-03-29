import Cheque, { IChequeParams } from "models/Cheque";
import Peer from "models/Peer";
import Node from "models/Node";

export const PAYMENT_THRESHOLD = 21080828914898;

enum EREQUEST {
  BALANCES = "swap_balances",
  CHEQUES = "swap_cheques"
}
const REQUESTS = [EREQUEST.BALANCES, EREQUEST.CHEQUES];

export enum ESTATUS {
  ACTIVE,
  CLOSED
}

type Response<T> = {
  id: number;
  result: { [key: string]: T };
};

class SwarmConnection {
  private connection?: WebSocket;
  private interval?: any;
  private _peers: Map<string, Peer>;
  private forceUpdate: () => void;
  updatedAt?: Date;
  node: Node;
  status: ESTATUS;
  message?: string;
  readonly connectionString: string;
  readonly label: string;

  constructor(
    connectionString: string,
    label: string,
    forceUpdate: () => void
  ) {
    this.forceUpdate = forceUpdate;
    this.connectionString = connectionString;
    this.label = label;
    this._peers = new Map();
    this.node = new Node();
    this.status = ESTATUS.CLOSED;

    this.makeRequests = this.makeRequests.bind(this);
    this.parseResponse = this.parseResponse.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onError = this.onError.bind(this);
    this.close = this.close.bind(this);

    const connection = new WebSocket(connectionString);

    connection.onopen = () => {
      this.status = ESTATUS.ACTIVE;
      this.makeRequests();
      this.interval = setInterval(this.makeRequests, 1000);
    };
    connection.onclose = this.onClose;
    connection.onerror = this.onError;
    connection.onmessage = this.parseResponse;
    this.connection = connection;
  }

  get peers() {
    return Array.from(this._peers.values());
  }

  close() {
    const { connection } = this;

    if (connection && connection.readyState === WebSocket.OPEN)
      connection.close();
  }

  private onClose(e: CloseEvent) {
    this.status = ESTATUS.CLOSED;
    console.log(e);
    this.message = `${e.code}: ${e.reason}`;
    const { interval } = this;
    if (interval) {
      clearInterval(interval);
      this.interval = undefined;
    }
  }
  private onError(e: Event) {
    this.status = ESTATUS.CLOSED;
    console.error(e);
    this.forceUpdate();
  }

  private makeRequests() {
    const { connection } = this;
    if (connection && connection.readyState === WebSocket.OPEN)
      REQUESTS.forEach((method, i) =>
        connection.send(JSON.stringify({ method, id: i }))
      );
  }

  private parseResponse(e) {
    const data = JSON.parse(e.data);
    if (data) {
      const { _peers, node } = this;
      switch (REQUESTS[data.id]) {
        case EREQUEST.BALANCES: {
          const d: Response<number> = JSON.parse(e.data);
          let b = 0;
          [...Object.entries(d.result)].forEach(([key, balance]) => {
            const r = _peers.get(key);
            if (r) r.balance = balance;
            else _peers.set(key, new Peer({ balance, swarmAddress: key }));
            b += balance;
          });
          node.currentHoneyBalance = b;
          this.updatedAt = new Date();
          break;
        }
        case EREQUEST.CHEQUES:
          {
            const d: Response<{
              LastSentCheque: IChequeParams;
              LastReceivedCheque: IChequeParams;
            }> = JSON.parse(e.data);
            let totalHoneySent = 0;
            let totalHoneyReceived = 0;
            [...Object.entries(d.result)].forEach(([key, cheque]) => {
              if (cheque) {
                const r = _peers.get(key);
                if (r) {
                  if (r.sentCheque) {
                    r.sentCheque.cumulativePayout =
                      cheque.LastSentCheque.CumulativePayout;
                    r.sentCheque.signature = cheque.LastSentCheque.Signature;
                    r.sentCheque.honey = cheque.LastSentCheque.Honey;
                  } else if (!r.sentCheque) {
                    r.sentCheque = new Cheque(cheque.LastSentCheque);
                  }
                } else
                  _peers.set(
                    key,
                    new Peer({
                      swarmAddress: key,
                      sentCheque: new Cheque(cheque.LastSentCheque)
                    })
                  );
                totalHoneySent += cheque.LastSentCheque.CumulativePayout;
                node.chequebookAddress = cheque.LastSentCheque.Contract;

                if (r) {
                  if (r.receivedCheque) {
                    r.receivedCheque.cumulativePayout =
                      cheque.LastReceivedCheque.CumulativePayout;
                    r.receivedCheque.signature =
                      cheque.LastReceivedCheque.Signature;
                    r.receivedCheque.honey = cheque.LastReceivedCheque.Honey;
                  } else if (!r.receivedCheque) {
                    r.receivedCheque = new Cheque(cheque.LastReceivedCheque);
                  }
                } else
                  _peers.set(
                    key,
                    new Peer({
                      swarmAddress: key,
                      receivedCheque: new Cheque(cheque.LastReceivedCheque)
                    })
                  );
                totalHoneyReceived +=
                  cheque.LastReceivedCheque.CumulativePayout;
                node.chequebookAddress = cheque.LastReceivedCheque.Contract;
              }
            });
            node.totalHoneySent = totalHoneySent;
            node.totalChequesSent = Math.floor(
              totalHoneySent / PAYMENT_THRESHOLD
            );
            node.totalHoneyReceived = totalHoneyReceived;
            node.totalChequesReceived = Math.floor(
              totalHoneyReceived / PAYMENT_THRESHOLD
            );
            this.updatedAt = new Date();
          }
          break;
      }
    }
    this.forceUpdate();
  }
}

export default SwarmConnection;
