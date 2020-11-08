import { observable, action } from 'mobx-miniprogram'

export const store = observable({
  types: [],

  // getters
  get getTypes() {
    return this.types
  },

  // actions
  setTypes: action(function (types) {
    this.types = types
  })
})
