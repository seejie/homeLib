// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')
cloud.init()
const log = cloud.logger()

// 云函数入口函数
exports.main = async (event) => {
  const { code } = event
  const {result: {appId, secret, api}} = await cloud.callFunction({
    name: 'config',
    data: {api: 'auth'}
  })
  
  log.info({name: 'login'})

  const lsj = 'ooc6r5bN7yWaFN3EqDr8yb1rUt1Q'
  return await rp({
    uri: `${api}?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`,
    json: true
  }).then(({session_key, openid}) => {
    console.log(session_key)
    // todo: token
    return openid
  })
}
