import config, { envId as env } from './contant'

export const db = (() => {
  wx.cloud.init({
    env,
    traceUser: true,
  })
  return wx.cloud.database({ env })
})()

export const cmd = db.command

export const operateSuccess = () => {
  wx.showToast({
    title: '操作成功',
    icon: 'none',
    duration: 1500
  })
}

