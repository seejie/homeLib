// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')
cloud.init()

// 云函数入口函数
exports.main = async () => {
  const {result: {appId, secret, api}} = await cloud.callFunction({
    name: 'config',
    data: {api: 'token'}
  })

  return await rp({
    uri: `${api}&appid=${appId}&secret=${secret}`,
    json: true
  }).then(res => {
    return res
  })
}