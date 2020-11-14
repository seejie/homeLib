import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../store/index'
import { db, cmd, operateSuccess } from '../../utils/util'

// todo: wx.showLoading、 wx.cloud.upLoadFile 、miniprogram-computed
// 自定义分析、实时日志、性能监控、wx.reportPerformance、小程序测速、
// 消息推送、数据周期性更新、数据预拉取、图片适配、滚动区域没有开启惯性滚动、API Promise化
// 图片压缩、图片方向、Cloud.logger、登录鉴权、Cloud.CDN、Cloud.checkLogin、
// 数据库 Explain API、云函数安全规则、wx.getSystemInfo、wx.getSystemInfo
// wx.getLaunchOptionsSync、wx.getEnterOptionsSync、wx.onUnhandledRejection、
// wx.onThemeChange、wx.onPageNotFound、wx.onError、wx.onAppShow、
// wx.onAppHide、wx.setEnableDebug、wx.showNavigationBarLoading、
// wx.startPullDownRefresh、wx.setStorageSync、wx.getImageInfo、
// wx.compressImage、wx.saveImageToPhotosAlbum、wx.login、wx.checkSession、
// wx.getUserInfo、UserInfo、wx.reportMonitor、wx.reportAnalytics、wx.authorize
// wx.getSetting、wx.openSetting、AuthSetting、SubscriptionsSetting
// wx.startSoterAuthentication、wx.checkIsSupportSoterAuthentication、
// wx.checkIsSoterEnrolledInDevice、wx.getPerformance、wx.getWifiList、
// wx.getBluetoothDevices、wx.getBatteryInfoSync、wx.onNetworkStatusChange
// wx.setScreenBrightness、wx.startCompass、wx.startDeviceMotionListening、
// wx.startGyroscope、wx.scanCode、wx.vibrateShort、subpackages、preloadRule、
// requiredBackgroundModes、permission、lazyCodeLoading、enablePullDownRefresh、
// initialRenderingCache、场景值列表、onShareAppMessage、onShareTimeline、
// onAddToFavorites、hidden、定义引用模板、<wxs>、setUpdatePerformanceListener、
// 局域网通信、分包加载、附近的小程序、<ad>、getuserriskrank、启动性能、

Page({
  data: {
    keyword: '',
    list: []
  },
  onLoad () {
    this.init()
  },
  onUnload() {
    this.storeBindings.destroyStoreBindings()
  },
  onShow () {
    this.init()
  },
  init () {
    this.initStore()
    this.getList()
    this.getTypes()
  },
  initStore () {
    this.storeBindings = createStoreBindings(this, {
      store,
      actions: ['setTypes'],
    })
  },
  getTypes () {
    db.collection('types')
      .where({
        _id: cmd.neq(null),
        deleted: cmd.eq(false)
      })
      .get()
      .then(({data}) => {
        const arr = data.map(({name}) => name)
        this.setTypes(arr)
      })
  },
  onrecord () {
    wx.navigateTo({
      url: '/pages/update/index',
    })
  },
  oninput (e) {
    const keyword = e.detail.value
    this.setData({keyword})
    this.getList()
  },
  onclear () {
    this.setData({keyword: ''})
    this.getList()
  },
  onedit (e) {
    const id = e.target.dataset.id
    wx.navigateTo({ url: `/pages/update/index?id=${id}` })
  },
  ondelete (e) {
    const id = e.target.dataset.id
    const self = this

    wx.showModal({
      title: '删除物品',
      content: '确定要删除吗？',
      success (res) {
        if (!res.confirm) return
        wx.cloud.callFunction({
          name: 'delItem',
          data: { id }
        }).then(() => {
          operateSuccess()
          self.getList()
        }).catch(console.error)
      }
    })    
  },
  getList() {
    const { keyword } = this.data

    db.collection('items')
      .where({
        _id: cmd.neq(null),
        deleted: cmd.eq(false),
        name: db.RegExp({
          regexp: keyword,
          options: '.'
        })
      })
      .get()
      .then(({data}) => {
        data.forEach(el => { el.imgs = el.imgs.length ? el.imgs : ['../../images/default.jpg'] })
        this.setData({ list: data })
      })
  },
  onZoom (e) {
    const urls = e.target.dataset.imgs.filter(el => !el.includes('default.jpg'))
    if (!urls.length) return
    wx.previewImage({ urls })
  },
  onaddTypes (e) {
    wx.navigateTo({ url: `/pages/type/index` })
  },
  onfilter (e) {
    // todo
  }
})
