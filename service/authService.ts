import jwt from "jsonwebtoken";

export type PayRoad = {
  userId: string;
  userName: string;
  setting: Setting;
};

export type Setting = {
  isDeleteModalShow: string;
};

function sign(payroad: PayRoad, key: string) {
  return jwt.sign(payroad, key);
}

function decode(token: string, key: string) {
  return jwt.verify(token, key);
}

export default {
  sign,
  decode,
} as const;
