
var Skyfall = {
  _servers: {},
  _settings: {
    animate: true,
    warningLevel: 40
  },

  getServer: function(serverName){
    if(this._servers[serverName]) {
      return this._servers[serverName];
    }
    return null;
  },

  addServer: function(serverName, ip, port, start){
    if(!port) { port = 3007; }
    if(!start) { start = true; }
    
    var socket = io.connect('http://' + ip + ':' + port, {
      'reconnect': true,
      'reconnection delay': 500,
      'max reconnection attempts': 5
    });

    var server = this._servers[serverName] = {
      name: serverName,
      ip: ip,
      port: port,
      socket: socket,
      cpuTimes: {},
      settings: {}
    };
    
    // sysInfo
    socket.on('sysInfo', $.proxy(this.sysInfo, server));
    // loadInfo
    socket.on('loadInfo', $.proxy(this.loadInfo, server));
    // diskspace
    socket.on('diskspace', $.proxy(this.diskspace, server));
    
    this.addListeners(server);
    if(start) { this.startServer(serverName); }
  },

  sysInfo: function(data) {
    Skyfall.log(data);

  },
  loadInfo: function(data) {
    Skyfall.log(data);
  },
  
  addListeners: function(server){
    var socket = server.socket;
    // connecting
    socket.on('connecting', $.proxy(function(){
      Skyfall.log('connecting...');
    }, server));
    // connect
    socket.on('connect', $.proxy(function(){
      Skyfall.log('connected');
    }, server));
    // connect_failed
    socket.on('connect_failed', $.proxy(function(){
      Skyfall.log('Failed to connect to ' + this.name);
    }, server));
    // disconnect
    socket.on('disconnect', $.proxy(function(){
      Skyfall.log('disconnected from ' + this.name);
    }, server));
    // reconnecting
    socket.on('reconnecting', $.proxy(function(){
      Skyfall.log('reconnecting...');
    }, server));
    // reconnect
    socket.on('reconnect', $.proxy(function(transport_type, reconnectionAttempts){
      Skyfall.log('reconnected to ' + this.name);
      Skyfall.startServer(this.name, server.settings);
    }, server));
    // reconnect_failed
    socket.on('reconnect_failed', $.proxy(function(){
      Skyfall.log('Failed to reconnect to ' + this.name);
    }, server));
    // error
    socket.on('error', $.proxy(function(msg){
      Skyfall.log('error: '+msg);
    }, server));
    // message
    socket.on('message', $.proxy(function(msg, callback){
      Skyfall.log(msg);
    }, server));
  },
  
  diskspace: function(data){
    var used = data.total - data.free;
    var pct = data.total > 0 ? Math.round((used / data.total) * 100) : 0;
    return pct;
  },
  
  startServer: function(serverName, opts){
    if(!opts) { opts = {}; }
    var server = Skyfall.getServer(serverName);
    server.socket.emit('start', opts);
  },
  
  stopServer: function(serverName){
    var server = Skyfall.getServer(serverName);
    server.socket.emit('stop', {});
  },
  
  removeServer: function(serverName){
    var server = Skyfall.getServer(serverName);
    server.socket.emit('stop', {});
    server.socket.disconnect();
    delete this._servers[serverName];
  },
  
  startAll: function(){
    for(var i=0; i<this._servers.length; i++){
      var server = this._servers[i];
      this.startServer(server.name, server.settings);
    }
  },
  
  stopAll: function(){
    for(var i=0; i<this._servers.length; i++){
      this.stopServer(this._servers[i].name);
    }
  },
  
  log: function(msg){
    if(console) {
      console.log(msg);
    } else {
      $('#log').text(msg);
    }
  },
  
  _convertTime: function(ts){
    var totalSec = ts,
      days = parseInt(totalSec / 86400),
      hours = parseInt(totalSec / 3600) % 24,
      minutes = parseInt(totalSec / 60) % 60,
      seconds = parseInt(totalSec % 60);

    var result = (days > 0 ? days + ' days ' : '') + (hours < 10 ? "0" + hours : hours) + "hrs " + (minutes < 10 ? "0" + minutes : minutes) + "min " + (seconds  < 10 ? "0" + seconds : seconds) + 'sec';
    return result;
  }
};