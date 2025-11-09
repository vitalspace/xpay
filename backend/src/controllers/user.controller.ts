import { Context } from "elysia";
import User from "../models/user.model.js";
import { IUser } from "../types/";
import { Horizon } from "stellar-sdk";

const horizonServer = new Horizon.Server("https://horizon-testnet.stellar.org");

export const createUser = async (ctx: Context) => {
  try {
    const { address, avatar, banner, username, email, bio } = ctx.body as IUser;
    const existingUser = await User.findOne({ address });

    if (existingUser) {
      ctx.set.status = 400;
      return { message: "User already exists" };
    }

    const newUser = new User({
      address,
      avatar,
      banner,
      username,
      email,
      bio,
    });

    await newUser.save();

    ctx.set.status = 201;
    return JSON.stringify(newUser);
  } catch (error) {
    ctx.set.status = 500;
    return { message: "internal server error" };
  }
};

export const updateUser = async (ctx: Context) => {
  try {
    const { address, ...updates } = ctx.body as Partial<IUser>;
    const user = await User.findOneAndUpdate({ address }, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      ctx.set.status = 404;
      return { message: "User not found" };
    }

    ctx.set.status = 200;
    return JSON.stringify(user);
  } catch (error) {
    ctx.set.status = 500;
    return { message: "internal server error" };
  }
};

export const profile = async (ctx: Context) => {
  try {
    const { address } = ctx.body as IUser;

    const user = await User.findOne({
      address,
    }).select("-_id -__v -updatedAt");

    if (!user) {
      ctx.set.status = 404;
      return { message: "User not found" };
    }

    ctx.set.status = 200;
    return JSON.stringify(user);
  } catch (error) {
    ctx.set.status = 500;
    return { message: "internal server error" };
  }
};

export const getUserBalance = async (ctx: Context) => {
  try {
    const { address } = ctx.body as any;
    const account = await horizonServer.loadAccount(address);
    const balance =
      account.balances.find((b: any) => b.asset_type === "native")?.balance ||
      "0";

    return JSON.stringify({ balance });
  } catch (error) {
    ctx.set.status = 500;
    return { message: "internal server error" };
  }
};

export const getUserTransactions = async (ctx: Context) => {
  try {
    const { address } = ctx.body as any;
    const transactions = await horizonServer
      .transactions()
      .forAccount(address)
      .limit(10)
      .call();

    const txns = transactions.records.map((tx: any) => ({
      id: tx.id,
      created_at: tx.created_at,
      source_account: tx.source_account,
      successful: tx.successful,
      memo: tx.memo,
      memo_type: tx.memo_type,
    }));

    return JSON.stringify({ transactions: txns });
  } catch (error) {
    ctx.set.status = 500;
    return { message: "internal server error" };
  }
};
