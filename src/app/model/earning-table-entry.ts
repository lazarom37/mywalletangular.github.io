import { Recurrence } from "./recurrence";

export interface EarningTableEntry {
  name: string;
  amount: number;
  recurrence: Recurrence;
}
