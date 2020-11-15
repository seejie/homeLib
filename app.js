//app.js
App({
  onLaunch: function (e) {
    this.init()
  },
  init () {
    this.getUserInfo()
    this.getSysInfo()
    this.getSetting()
    this.performance()
    this.report()
    this.initAuth()
    this.login()
    this.test()
  },
  getUserInfo () {
    wx.getUserInfo()
      .then(res => {
        const { rawData } = res
        const info = JSON.parse(rawData)
        console.log(info)
      })
  },
  getSysInfo () {
    wx.getSystemInfo()
      .then(res => {
        console.log(res)
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
      success () {
        // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
        // wx.startRecord()
      }
    })
  },
  login () {
    wx.login()
      .then(({code}) => {
        wx.cloud.callFunction({
          name: 'login',
          data: { code }
        }).then(res => {
          console.log(res,111)
          wx.checkSession()
            .then(res => {
              console.log(res)
            })
        })
      })
  },
  test () {
    wx.setScreenBrightness({value: .4})
      .then(res => {
        console.log(res)
      })
  }
})
