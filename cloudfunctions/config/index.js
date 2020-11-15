// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const appId = 'wx0db6967f28874943'
const secret = '6f7b33dfa0c266f9657148331195c74b'
const api = {
  auth: 'https://api.weixin.qq.com/sns/jscode2session',
  token: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential'
}

// 云函数入口函数
// 必须要有async因为调用的地方使用了await
exports.main = async (event) => {
  return {
    appId,
    secret,
    api: api[event.api]
  }
}