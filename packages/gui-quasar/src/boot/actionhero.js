// import something here
// var ActionheroWebsocketClient;
import util from 'util'
import Vue from 'vue'
// import '../../../gglass/public/js/ActionheroWebsocketClient'

let AhClient = new ActionheroWebsocketClient()

// let client = {}
let client = Object.create(ActionheroWebsocketClient.prototype)

for (let func of Object.keys(ActionheroWebsocketClient.prototype)) {
  // console.log({func})
  client[func] = function (...args) {
    return new Promise((resolve, reject) => {
      AhClient[func](...args, (data, err) => {
        if (err) {reject(err)}
        resolve(data)
      })
    })
  }
}

Vue.prototype.$actionhero = client
