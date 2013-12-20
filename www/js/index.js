var trans = new PageTransitions();

var confg;

$.getJSON("js/config.json", function(json) {
    config = json;
});

var Socket = {
    init: function(){
        var socket = io.connect(config.monitor);

        document.getElementById('log').innerHTML = "connecting";

        socket.on('ping', function (data) {
            document.getElementById('log').innerHTML = data.message;
            socket.emit('pong', { message: 'Hello from client!' });
        });

        socket.on('connect', function () {
            document.getElementById('log').innerHTML = "connected";
        });

        socket.on('reconnect', function () {
            document.getElementById('log').innerHTML = "reconnected";
        });

        socket.on('disconnect', function () {
            document.getElementById('log').innerHTML = "disconnected";
        });

        socket.on('reconnecting', function () {
            document.getElementById('log').innerHTML = "reconnecting...";
        });

        socket.on('error', function () {
            document.getElementById('log').innerHTML = "error";
        });
    }
};

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
            trans.go($('.pt-page-1'),$('.pt-page-2'),"up");
            Socket.init();
            //document.addEventListener("deviceready", init, false);
        },3000);
    }
};