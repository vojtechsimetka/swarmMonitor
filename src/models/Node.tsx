export interface INodeParams {
  address?: string;
  chequebookAddress?: string;
  currentHoneyBalance?: number;
  totalHoneySent?: number;
  totalHoneyReceived?: number;
  totalChequesSent?: number;
  totalChequesReceived?: number;
}

export default class Node {
  address: string;
  chequebookAddress: string;
  currentHoneyBalance: number;
  totalHoneySent: number;
  totalHoneyReceived: number;
  totalChequesSent: number;
  totalChequesReceived: number;

  constructor({
    address,
    chequebookAddress,
    currentHoneyBalance,
    totalHoneySent,
    totalHoneyReceived,
    totalChequesSent,
    totalChequesReceived
  }: INodeParams = {}) {
    this.address = address || "";
    this.chequebookAddress = chequebookAddress || "";
    this.currentHoneyBalance = currentHoneyBalance || 0;
    this.totalHoneySent = totalHoneySent || 0;
    this.totalHoneyReceived = totalHoneyReceived || 0;
    this.totalChequesSent = totalChequesSent || 0;
    this.totalChequesReceived = totalChequesReceived || 0;
  }
}
