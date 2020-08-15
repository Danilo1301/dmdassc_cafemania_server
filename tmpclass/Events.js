Events = class {
  static all = [];

  static eventCallbacks = {};

  static on(id, callback)
  {
    if(!this.eventCallbacks[id]) { this.eventCallbacks[id] = []; }
    this.eventCallbacks[id].push(callback);
  }

  static clear()
  {
    if(this.all.length > 0) {
      console.log(`Cleared ${this.all.length} events`)
    }
    this.all = [];
  }

  static trigger(id, data)
  {
    //console.log(`${id}`, data);
    this.all.push({id: id, data: data});

    if(this.eventCallbacks[id]) {
      for (var fn of this.eventCallbacks[id]) {
        fn(data);
      }
    }
  }
}
