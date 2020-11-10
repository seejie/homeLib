// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  const { id } = event
  if (!id) return
  console.log(id,000)
  await db.collection('items')
    .where({id: _.eq(id)})
    .update({data: {delete: true}}) 

  return {
    result: true
  }
}