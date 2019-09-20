import { Document, Schema, model, Model } from 'mongoose';

let accountRegExp = /^[a-zA-Z0-9]{5,20}$/;

export interface CommentDocument extends Document {
  account: string,
  for: string,
  content: string,
  createTime: number,
  lastModified: number,
  diabled: boolean,
  parentId: string,
  responsive: boolean,
  private: boolean,
  deleted: boolean,
  modifications: Array<{
    content: string,
    createTime: string
  }>,
  stars: Array<{
    account: string,
    starTime: number
  }>,
  modifiedTimes: number,
  starsNumber: number
}

let ModificationSchema = new Schema<{}>({
  // 某个版本的评论的具体内容
  content: { type: String, required: true },
  // 某个版本的评论的发布时间
  createTime: { type: Date, default: Date.now },
})

let StarSchema = new Schema<{}>({
  // 点赞的账户
  account: { type: String, required: true, match: accountRegExp, index: true },
  // 点赞的时间
  starTime: { type: Date, default: Date.now },
})

let CommentSchema = new Schema<{}>({
  // 发布评论的账户
  account: { type: String, required: true, match: accountRegExp, index: true },
  // 被评论的文章
  for: { type: String, required: true, index: true },
  // 评论的具体内容
  content: { type: String, required: true },
  // 首版评论的发布时间
  createTime: { type: Date, default: Date.now },
  // 最新版评论的发布时间
  lastModified: { type: Date, default: Date.now },
  // 禁止状态
  diabled: { type: Boolean, default: false },// 此评论是否已被禁止，是则此评论和所有对此评论的追加评论将无法被查询到
  // 追加评论
  parentId: { type: String, default: '' },// 此评论是否是对其他评论的追加评论，是则值为上级评论的id，否则为对文章的直接评论，值为空
  // 可评论
  responsive: { type: Boolean, default: true },// 是否可以对此评论进行追加评论(用户设置)
  // 私密
  private: { type: Boolean, default: false },//此评论是否私密评论，是则根据parentId，为对其他评论的直接评论时，只对其他评论的发布者可见，为对文章的直接评论者时，只对文章的直接评论者可见
  // 删除
  deleted: { type: Boolean, default: false },//用户是否删除了此评论；是则此评论和所有对此评论的追加评论将无法被查询到
  // 历史内容记录
  modifications: [ModificationSchema],//每次修改后，都会将原内容及其时间存入此数组，然后用新数据替换content
  // 点赞记录
  stars: [StarSchema]
})

// 修改次数
CommentSchema.virtual('modifiedTimes').get(function (): number {
  let self = this as CommentDocument
  return self.modifications.length;
});

// 点赞数目
CommentSchema.virtual('starsNumber').get(function () {
  let self = this as CommentDocument
  return self.stars.length;
});

export const CommentModel = model<CommentDocument>('Comment', CommentSchema);