import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../store/index'
import { db, cmd, operateSuccess } from '../../utils/util'

// todo: 小程序测速、消息推送、局域网通信

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
    this.getTypes2()
    // db.collection('types')
    //   .where({
    //     _id: cmd.neq(null),
    //     deleted: cmd.eq(false)
    //   })
    //   .get()
    //   .then(({data}) => {
    //     const arr = data.map(({name}) => name)
    //     this.setTypes(arr)
    //   })
  },
  getTypes2 () {
    wx.cloud.callFunction({
      name: 'getTypes'
    }).then(({result}) => {
      const arr = result.map(({name}) => name)
      this.setTypes(arr)
    })
  },
  onrecord () {
    wx.navigateTo({ url: '/pages/update/index' })
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
      content: '确定要删除吗？'
    }).then(res => {
      if (!res.confirm) return
      wx.cloud.callFunction({
        name: 'delItem',
        data: { id }
      }).then(() => {
        operateSuccess()
        self.getList()
      }).catch(console.error)
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
      .get({
        // explain: true,
        // complete: console.log,
      })
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
