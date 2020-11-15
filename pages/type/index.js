import { createStoreBindings } from 'mobx-miniprogram-bindings' 
import { store } from '../../store/index'
import { db, cmd, operateSuccess } from '../../utils/util'

Page({
  data: {
    curr: [],
    keyword: ''
  },
  onLoad (options) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['types'],
      actions: ['setTypes']
    })
    wx.nextTick(() => {
      this.setData({ curr: this.data.types})
    })
  },
  onUnload() {
    this.storeBindings.destroyStoreBindings()
  },
  onback () {
    wx.navigateTo({ url: '/pages/index/index' })
  },
  onadd () {
    const { keyword, curr } = this.data
    const key = keyword.trim()
    if (!key) return
    const exist = curr.find(el => el === key)
    if (exist) return

    db.collection('types')
      .add({ 
        data: { 
          name: keyword,
          deleted: false,
        } 
      })
      .then(res => {
        this.getData()
        this.setData({ keyword: '' })
      })
  },
  ondelete (e) {
    const name = e.target.dataset.name
    wx.cloud.callFunction({
      name: 'delTypes',
      data: { name }
    })
    .then(res => this.getData())
  },
  onchange (e) {
    const keyword = e.detail.value
    this.setData({ keyword })
  },
  getData () {
    db.collection('types')
      .where({
        _id: cmd.neq(null),
        deleted: false
      })
      .get()
      .then(({ data }) => {
        const curr = data.map(({name}) => name)
        this.setTypes(curr)
        this.setData({ curr })
        operateSuccess()
      })
  }
})