import { cmd, db } from './utils/util'
import {noticeTempId} from './utils/contant'
const log = require('./utils/log')

//app.js
App({
  globalData: {
    openId: null
  },
  onLaunch: function (e) {
    this.init()
  },
  init () {
    this.login()
    this.getSetting()
    // this.performance()
    // this.report()
    // this.initAuth()
    this.logger()
    this.test()
    this.authMsg()
  },
  getUserInfo () {
    db.collection('users')
      .where({
        _openid: cmd.eq(this.globalData.openId)
      }).get()
      .then(({data}) => {
        if (data.length) return
        wx.getUserInfo()
          .then(res => {
            const { rawData } = res
            const info = JSON.parse(rawData)

            db.collection('users')
              .add({ 
                data: { 
                  ...info,
                  createTime: db.serverDate()
                }
              })
          })
      })
  },
  getSysInfo () {
    db.collection('devices')
      .where({
        _openid: cmd.eq(this.globalData.openId)
      }).get()
      .then(({data}) => {
        if (data.length) return
        wx.getSystemInfo()
          .then((res) => {
            delete res.errMsg
            db.collection('devices')
              .add({ 
                data: { 
                  ...res,
                  createTime: db.serverDate()
                } 
              })
          })
      })
  },
  getSetting () {
    wx.getSetting()
      .then(({ authSetting }) => {
        console.log(authSetting)
      })
  },
  performance () {
    const performance = wx.getPerformance()
    const observer = performance.createObserver((entryList) => {
      console.log(entryList.getEntries())
    })
    observer.observe({ entryTypes: ['render', 'script'] })
  },
  report () {
    wx.reportMonitor('0', 111)
    wx.reportAnalytics('login', { test: 123 })
    wx.reportPerformance(2001, 680, 'custom')
  },
  initAuth () {
    wx.authorize({
      scope: 'scope.userInfo',
    }).then(res => {
      console.log(res)
    })
  },
  login () {
    wx.login()
      .then(({code}) => {
        wx.cloud.callFunction({
          name: 'login',
          data: { code }
        }).then(({result}) => {
          this.globalData.openId = result
          this.getUserInfo()
          this.getSysInfo()
          // wx.checkSession()
          //   .then(res => {
          //     console.log(res)
          //   })
        })
      })
  },
  logger () {
    log.info('welcome ！！！') 
  },
  authMsg () {
    let self = this ;
    wx.showModal({
      title: '温馨提示',
      content: '为更好体验服务',
      confirmText:"同意",
      cancelText:"拒绝",
      success (res) {
        if (!res.confirm)  return
        wx.requestSubscribeMessage({
          tmplIds: [noticeTempId],
          success (res) { 
            console.log(res)
            wx.cloud.callFunction({
              name:'sendMsg', 
              data: {
                id: self.globalData.openId,
                tempId: noticeTempId
              }
            })
          },
          fail (res) {
            console.log(res)
          }
        })
      }
    // }).then(res => {
    //   if (!res.confirm)  return
    //   wx.requestSubscribeMessage({
    //     tmplIds: ['pWefM7TK4_2p7xMKRkl9en17TV1P8w2HKlsLe4Kgvvk'],
    //     success (res) { 
    //       console.log(res)
    //     },
    //     fail (res) {
    //       console.log(res)
    //     }
    //   })
    })
  },
  test () {
    console.log(1)
    // wx.setEnableDebug({
    //   enableDebug: true
    // })
  }
})
