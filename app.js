import { cmd, db } from './utils/util'
import {noticeTempId} from './utils/contant'
const log = require('./utils/log')

//app.js
App({
  globalData: {
    openId: null
  },
  // 流程：检查登录态【1】=>1.重新登录=>获取用户信息、设备信息=>初始化=>
  // 【1】=>2.初始化=>检测用户授权信息=>若检测到未授权的权利【2】=>1.申请相应授权=>首页
  // 【2】=>2.使用相应能力时再申请授权=>首页
  onLaunch: function (e) {
    this.checkUser()
    this.debug()
  },
  init () {
    this.checkUserAuthSetting()
    this.performance()
    this.report()
    this.logger()
    this.authMsg()
  },
  getUserInfo () {
    db.collection('users')
      .where({
        _openid: cmd.eq(this.globalData.openId)
      }).get()
      .then(({data}) => {
        if (data.length >= 2) return
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
  checkUserAuthSetting () {
    const self = this
    wx.getSetting({
      withSubscriptions: true,
      success: function ({authSetting}) {
        // console.log('授权信息：', authSetting)
        self.initAuth()
      },
      fail: function (res) {
        console.log('获取授权信息失败')
      }
    })
  },
  performance () {
    const performance = wx.getPerformance()
    const observer = performance.createObserver((entryList) => {
      // console.log(entryList.getEntries())
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
      // scope: 'scope.userInfo',
      scope: 'scope.userLocation',
      success: function (res) {
        console.log('授权成功：', res)
      },
      fail: function (res) {
        console.log('授权失败：', res)
      }
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
          this.init()
        })
      })
  },
  logger () {
    log.info('welcome ！！！') 
  },
  authMsg () {
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
            console.log('授权订阅消息成功：', res)
          },
          fail (res) {
            console.log('授权订阅消息失败：', res)
          }
        })
      }
    })
  },
  debug () {
    wx.setEnableDebug({
      enableDebug: true
    }).then(res => {
      console.log(res)
    }).catch(err => {
      // console.log(err)
    })
  },
  checkUser () {
    const self = this
    // 检查登录态是否过期
    wx.checkSession({
      // 未过期
      success (res) {
        self.init()
        self.getUserInfo()
      },
      // 过期
      fail (res) {
        self.login()
      }
    })
  },
  sendMsg () {
    wx.cloud.callFunction({
      name:'sendMsg', 
      data: {
        id: this.globalData.openId,
        tempId: noticeTempId
      }
    })
  }
})
