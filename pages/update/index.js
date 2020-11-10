import { db, cmd } from '../../utils/util'
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
    const { _id, name, type, desc, exp, imgs } = this.data

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
      .add({ data: this.data })
      .then(({_id}) => {
        if (!_id) return
        wx.showToast({
          title: '添加成功！',
          icon: 'none',
          duration: 1500
        })
      })
  },
  editItem (id) {
    // todo: 云函数
    const data = this.data
    delete data._id

    db.collection('items')
      .doc(id)
      .update({ data })
      .then(res => {
        wx.showToast({
          title: '修改成功！',
          icon: 'none',
          duration: 1500
        })
      })
  }
})
