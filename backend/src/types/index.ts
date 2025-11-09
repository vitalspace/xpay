export interface IUser {
  address: string;
  avatar: string;
  banner: string;
  username: string;
  email: string;
  bio: string;
}

export interface IPayment {
  userId: string;
  amount: string;
  asset: string;
  destination: string;
  transactionHash: string;
  memo?: string;
  status: "pending" | "completed" | "failed";
}
