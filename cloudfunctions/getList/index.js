// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { curr, offset, limit, keyword } = event
  const list = await db.collection('items')
    .where({delete: _.eq(false)})
    .get().then(res => res.data)
  
  return {
    list
  }
}
