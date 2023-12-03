import { Recurrence } from "./recurrence";

export interface PaymentTableEntry {
  name: string;
  amount: number;
  recurrence: Recurrence;
  userID: string;
  id: string;
}