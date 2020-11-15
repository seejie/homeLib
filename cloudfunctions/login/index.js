// 云函数入口文件
const cloud = require('wx-server-sdk')
const config = require('../config')
const rp = require('request-promise')

cloud.init()
const {appId, secret, api} = config
// 云函数入口函数
exports.main = async (event) => {
  const { code } = event
  console.log(code)

  return await rp({
    uri: `${api.auth}?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`,
    json: true
  }).then(({session_key, openid}) => {
    console.log(openid)
    console.log(session_key)
    const token = 12345
    // todo: token
    return token
  })
}
