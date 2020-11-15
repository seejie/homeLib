// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async ({ id }) => {
  if (!id) return
  await db.collection('items')
    .doc(id)
    .update({
      data: {
        deleted: true,
        delTime: db.serverDate()
      }
    }) 

  return {
    result: true
  }
}