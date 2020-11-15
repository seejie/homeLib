import { cmd, db } from './utils/util'

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
    // this.getSetting()
    // this.performance()
    // this.report()
    // this.initAuth()
    this.test()
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
              .add({ data: { ...info } })
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
              .add({ data: { ...res } })
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
  test () {
    console.log(1)
  }
})
