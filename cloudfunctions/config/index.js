// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const appId = 'wx0db6967f28874943'
const secret = '6f7b33dfa0c266f9657148331195c74b'
const api = {
  auth: 'https://api.weixin.qq.com/sns/jscode2session',
  getToken: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential'
}

// 云函数入口函数
exports.main = () => {
  console.log(1)
  return {
    appId,
    secret,
    api
  }
}
