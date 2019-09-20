import { Document, Schema, Model, model, DocumentQuery } from 'mongoose';

let accountRegExp = /^[a-zA-Z0-9]{5,20}$/;

export interface AccountDocument extends Document {
  account: string,
  password: string,
  username: string,
  avatar: string,
  level: string,
  status: string,
  registerTime: Date
}

let AccountSchema = new Schema<{}>({
  // 账户
  account: { type: String, required: true, match: accountRegExp, index: true },
  // 密码
  password: { type: String, required: true, match: accountRegExp },
  // 用户名
  username: { type: String, default: '' },
  // 头像
  avatar: { type: String, default: '' },
  // 账户等级
  level: { type: String, default: 'default', enum: ['default', 'admin', 'private'] },
  // 状态
  status: { type: String, default: 'normal', enum: ['normal', 'diabled'] },
  // 注册时间
  registerTime: { type: Date, default: Date.now }
})

AccountSchema.statics.findByAccount = function (account: string) {
  let self = this as Model<AccountDocument, {}>;
  return self.findOne({ account })
}

export const AccountModel = model<AccountDocument>('Account', AccountSchema) as Model<AccountDocument, {}> & {
  findByAccount: (account: string) => DocumentQuery<AccountDocument, AccountDocument, {}>
};