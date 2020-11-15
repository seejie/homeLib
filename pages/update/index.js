import { db, operateSuccess } from '../../utils/util'
import { Item } from '../../utils/contant'

Page({
  data: {
    _id: null,
    ...Item
  },
  onLoad({ id }){
    this.setData({ _id: id })
    wx.setNavigationBarTitle({ title: id ? '修改物品' : '录入物品' })
    this.getInfoById(id)
  },
  getInfoById (id) {
    if (!id) return

    db.collection('items')
      .doc(id)
      .get()
      .then(({ data }) => this.setData(data))
  },
  oncancel () {
    this.setData({...Item, id: null})
    wx.navigateBack({ changed: true })
  },
  oncomfirm () {
    const { _id, name } = this.data

    if (!name) {
      wx.showToast({
        title: '请输入名称',
        icon: 'none',
        duration: 1500
      })
    } 
    this[_id ? 'editItem' : 'addItem'](_id)
  },
  addItem () {
    db.collection('items')
      .add({ 
        data: {
          ...this.data,
          createTime: db.serverDate()
        }
      })
      .then(({_id}) => {
        if (!_id) return
        operateSuccess()
        wx.navigateBack({ changed: true })
      })
  },
  editItem (id) {
    const data = this.data

    wx.cloud.callFunction({
      name: 'editItem',
      data: { data }
    }).then(() => {
      operateSuccess()
      wx.navigateBack({ changed: true })
    }).catch(console.error)
  },
  ontextchanged (e) {
    const attr = e.target.dataset.attr
    const val = e.detail.val
    this.setData({ [attr]: val})
  }
})
