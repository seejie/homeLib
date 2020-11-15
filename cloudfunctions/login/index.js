// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')
cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  const { code } = event
  const {result: {appId, secret, api}} = await cloud.callFunction({
    name:'config',
    data: {api: 'auth'}
  })

  return await rp({
    uri: `${api}?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`,
    json: true
  }).then(({session_key, openid}) => {
    console.log(openid)
    console.log(session_key)
    const token = 12345
    // todo: token
    return token
  })
}
