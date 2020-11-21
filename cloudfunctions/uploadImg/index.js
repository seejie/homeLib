// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 云函数入口函数
exports.main = async ({buff, name}) => {
  return await cloud.uploadFile({
    cloudPath: `images/${name}`,
    fileContent: Buffer.from(buff.data),
  })
}
