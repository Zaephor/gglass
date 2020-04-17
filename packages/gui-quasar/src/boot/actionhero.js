import Vue from "vue";

let AhClient = new ActionheroWebsocketClient();

let client = Object.create(ActionheroWebsocketClient.prototype);

for (let func of Object.keys(ActionheroWebsocketClient.prototype)) {
  client[func] = function (...args) {
    return new Promise((resolve, reject) => {
      AhClient[func](...args, (data, err) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  };
}

// Vue.prototype.$actionhero.connect().then(success => console.log({ success })).catch(err => {console.log({ err })})
AhClient.connect((err, details) => {
  if (err !== null) {
    console.log(err);
  }
});

Vue.prototype.$actionhero = client;
