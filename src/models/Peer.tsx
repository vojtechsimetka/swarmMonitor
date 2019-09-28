import Cheque from "models/Cheque";

export interface IPeerParams {
  swarmAddress: string;
  balance?: number;
  sentCheque?: Cheque;
  receivedCheque?: Cheque;
}

export default class Peer {
  swarmAddress: string;
  balance: number;
  sentCheque?: Cheque;
  receivedCheque?: Cheque;

  constructor({
    swarmAddress,
    balance,
    sentCheque,
    receivedCheque
  }: IPeerParams) {
    this.swarmAddress = swarmAddress;
    this.balance = balance || 0;
    this.sentCheque = sentCheque;
    this.receivedCheque = receivedCheque;
  }
}
