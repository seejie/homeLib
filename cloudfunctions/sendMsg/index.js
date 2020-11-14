// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { id, token } = event
  return await rp({
    uri: `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/uniform_send?access_token=${token}`,
    method: 'POST',
    body: {
      touser: id
    },
    json: true
  }).then(res => {
    console.log(res)
  })
}