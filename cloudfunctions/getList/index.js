// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { curr, offset, limit, keyword } = event

  return {
    list: [{
      id: 1,
      img: '',
      name: '111',
      desc: 'xxx',
      exp: '123',
      loc: ''
    }, {
      id: 2,
      img: '',
      name: '222',
      // desc: 'yyy',
      exp: 'abc',
      loc: ''
    }]
  }
}
