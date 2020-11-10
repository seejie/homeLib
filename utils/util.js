import config, { envId as env } from './contant'

export const db = (() => {
  wx.cloud.init({
    env,
    traceUser: true,
  })
  return wx.cloud.database({ env })
})()

export const cmd = db.command

