import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../store/index'

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
  init () {
    this.initStore()
    this.initCloud()
    this.getList()
    this.getTypes()
  },
  initStore () {
    this.storeBindings = createStoreBindings(this, {
      store,
      actions: ['setTypes'],
    })
  },
  initCloud () {
    wx.cloud.init({
      // env: 'test-7gglkliibd5d395e',
      traceUser: true,
    })
  },
  getList () {
    const { keyword } = this.data
    wx.cloud.callFunction({
      name: 'getList',
      data: {
        keyword,
        curr: 1,
        limit: 10,
        offset: 0,
      }
    }).then(({result}) => {
      result.list.forEach(el=>{
        el.img = el.img || '../../images/default.jpg'
      })
      console.log(result.list)
      this.setData({ list: result.list })
    }).catch(console.error)
  },
  getTypes () {
    wx.cloud.callFunction({
      name: 'getOptions',
      data: {}
    }).then(({result}) => {
      this.setTypes(result.options)
    }).catch(console.error)
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
          data: {id}
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
  }
})
