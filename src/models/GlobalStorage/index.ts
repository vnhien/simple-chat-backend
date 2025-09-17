import { PushSubscription } from "web-push";

export type TGlobalStorage = {
  connected: {
    [userId: string]: string;
  };
  status: {
    [userId: string]: string;
  };
  subscriptions: {
    [userId: string]: PushSubscription;
  };
};

export const globalStorage: TGlobalStorage = {
  connected: {},
  status: {},
  subscriptions: {},
};
