// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async ({name}) => {

  db.collection('types')
  .where({ name: _.eq(name) })
  .update({ data: { deleted: true } })

  return {
    result: true
  }
}