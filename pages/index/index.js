import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../store/index'
import { db, cmd } from '../../utils/util'

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
        this.setData({ types: data })
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
    wx.navigateTo({
      url: `/pages/update/index?id=${id}`,
    })
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
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1500
          })
          self.getList()
        }).catch(console.error)
      }
    })    
  },
  getList() {
    const { keyword } = this.data
    const data = {
      keyword,
      curr: 1,
      limit: 10,
      offset: 0,
    }

    db.collection('items')
      .where({
        _id: cmd.neq(null),
        deleted: cmd.eq(false)
      })
      .get()
      .then(({data}) => {
        data.forEach(el => { el.imgs = el.imgs.length ? el.imgs : ['../../images/default.jpg'] })
        this.setData({ list: data })
      })
  }
})
