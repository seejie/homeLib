// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')

cloud.init()

const appId = 'wx0db6967f28874943'
const secret = '6f7b33dfa0c266f9657148331195c74b'
// 云函数入口函数
exports.main = async (event, context) => {
  return await rp({
    uri: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${secret}`,
    json: true
  }).then(res => {
    return res
  })
}