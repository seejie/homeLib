// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')

cloud.init()

// 云函数入口函数
exports.main = async event => {
  const { id, tempId } = event
  const {result: {api}} = await cloud.callFunction({
    name: 'config',
    data: {api: 'notice'}
  })

  const {result:{access_token}} = await cloud.callFunction({name: 'getToken'})
  // todo：定时消息
  return await rp({
    uri: `${api}?access_token=${access_token}`,
    method: 'POST',
    body: {
      touser: id,
      template_id: tempId,
      data: {
        date2: {
          value: '2019-12-23 12:00:00'
        },
        thing1: {
          value: '通知'
        },
        thing3: {
          value: '提交'
        }
      }
    },
    json: true
  }).then(res => {
    console.log(res)
  })
}