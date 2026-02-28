export interface PollState {
  active: boolean;
  pollId?: string;
  question?: string;
  options?: {
    id: string;
    text: string;
  }[];
  remainingTime?: number;
}