var trans = new PageTransitions();

var config;

function testApp(servers) {
  for (var name in servers) {
    var address,
        server = servers[name],
        port = 3007;

    if (typeof server === 'object') {
        address = server['address'];
        if (server['port']) { port = server['port']; }
    } else {
        var split = server.split(':');
        address = split[0];
        if (split.length > 1) { port = split[1]; }
    }
    Skyfall.addServer(name, address, port);
  }
}

$.getJSON("js/config.json", function(json) {
  config = json;
  trans.go($('.pt-page-1'),$('.pt-page-2'),"up");
  testApp(config.servers);
});

var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    app.receivedEvent('deviceready');
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);

    var exitSplash = setTimeout(function(){
      //trans.go($('.pt-page-1'),$('.pt-page-2'),"up");
    },3000);
  }
};

