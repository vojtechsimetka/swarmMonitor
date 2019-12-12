export interface IChequeParams {
  Beneficiary: string;
  Contract: string;
  CumulativePayout: number;
  Honey: number;
  Signature: string;
}

export default class Cheque {
  beneficiary: string;
  contract: string;
  cumulativePayout: number;
  honey: number;
  signature: string;

  constructor({
    Beneficiary,
    Contract,
    CumulativePayout,
    Honey,
    Signature
  }: IChequeParams) {
    this.beneficiary = Beneficiary || "";
    this.contract = Contract || "";
    this.honey = Honey || 0;
    this.cumulativePayout = CumulativePayout || 0;
    this.signature = Signature || "";
  }
}
