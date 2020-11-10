Page({
  data: {
    id: null,
    name: '',
    type: '',
    price: '',
    loc: '',
    desc: '',
    exp: '',
    imgs: []
  },
  onLoad({ id }){
    this.setData({ id })
    wx.setNavigationBarTitle({
      title: id ? '修改物品' : '录入物品'
    })
    this.getInfoById(id)
  },
  getInfoById (id) {
    if (!id) return
    this.setData({
      id: 0,
      name: 'xxxx',
      type: '',
      desc: '11111',
      exp: '2020-12-31',
      imgs: ['../../images/default.jpg']
    })
  },
  oncancel () {
    this.setData({
      id: null,
      name: '',
      type: '',
      desc: '',
      exp: '',
      imgs: []
    })

    wx.navigateBack({ changed: true })
  },
  oncomfirm () {
    const { id, name, type, desc, exp, imgs } = this.data
    if (!name) {
      wx.showToast({
        title: '请输入名称',
        icon: 'none',
        duration: 1500
      })
    } 
  }
})
