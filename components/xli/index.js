import { storeBindingsBehavior } from 'mobx-miniprogram-bindings' 
import { store } from '../../store/index'

Component({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    fields: ['types']
  },
  properties: {
    name: String,
    val: String,
    type: {
      type: String,
      value: 'input'
    },
    require: {
      type: Boolean,
      value: false
    },
    imgs: {
      type: Array,
      value: []
    }
  },
  data: {
    start: new Date().toLocaleDateString().replace(/\//g, '-'),
    father: null
  },
  ready () {
    this.init()
  },
  methods: {
    init () {
      const pages = getCurrentPages()
      this.setData({ father: pages.reverse()[0] })
    },
    onTxtChange (e) {
      const val = e.detail.value
      this.data.father.setData({ name: val })
    },
    onTypeChange (e) {
      const idx = e.detail.value
      this.data.father.setData({ type: idx })
    },
    onDescChange (e) {
      const val = e.detail.value
      this.data.father.setData({ desc: val })
    },
    onDateChange (e) {
      const val = e.detail.value
      this.data.father.setData({ exp: val })
    },
    getPhoto () {
      const self = this
      wx.chooseImage({
        count: 3,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          // todo: 上传图片
          const paths = res.tempFilePaths
          self.data.father.setData({ imgs: self.data.imgs.concat(paths) })
        }
      })
    },
    ondelete (e) {
      const idx = e.target.dataset.idx
      const arr = this.data.father.data.imgs.filter((el, index) => index !== idx)
      this.data.father.setData({ imgs: arr })
    }
  },
})
