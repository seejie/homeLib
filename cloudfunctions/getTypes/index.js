// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async () => {
  return db.collection('types')
    .where({
      _id: _.neq(null),
      deleted: _.eq(false)
    })
    .get()
    .then(({data}) => {
      return data
    })
}