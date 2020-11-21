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
  computed: {
    realIdx (data) {
      console.log(data)
      return 0
    }
  },
  methods: {
    init () {
      const pages = getCurrentPages()
      this.setData({ father: pages.reverse()[0] })
    },
    onTxtChange (e) {
      const val = e.detail.value
      this.triggerEvent('update', { val })
    },
    onTypeChange (e) {
      const idx = +e.detail.value
      const type = this.data.types[idx].name
      this.data.father.setData({ type })
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
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      }).then(res => {
        const src = res.tempFilePaths[0]
        const path = src.replace('http://tmp/', '').split('.')
        const name = `${path[2].slice(12)}.${path[3]}`
        wx.getFileSystemManager().readFile({
          filePath: src,
          success ({data}) {
            wx.cloud.callFunction({
              name: 'uploadImg',
              data: {
                buff: data,
                name
              }
            }).then(({ result: {fileID} }) => {
              self.data.father.setData({ imgs: self.data.imgs.concat([fileID]) })
            })
          }
        })
      })
    },
    ondelete (e) {
      const idx = e.target.dataset.idx
      const arr = this.data.father.data.imgs.filter((el, index) => index !== idx)
      this.data.father.setData({ imgs: arr })
    },
    getRealTxt (a) {
      console.log(a)
    }
  }
})
