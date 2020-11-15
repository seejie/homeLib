// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')
const config = require('../config')
cloud.init()
const {appId, secret, api} = config

// 云函数入口函数
exports.main = async (event, context) => {
  return await rp({
    uri: `${api.getToken}&appid=${appId}&secret=${secret}`,
    json: true
  }).then(res => {
    return res
  })
}