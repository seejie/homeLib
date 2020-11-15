// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async ({data}) => {
  const { _id: id, ...rest } = data

  db.collection('items')
    .doc(id)
    .update({ data: rest })

  return {
    result: true
  }
}