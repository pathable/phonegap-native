var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
//        app.initPushwoosh();
        app.loadPage();
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },

    encode: function() {

    },
    
    initPushwoosh : function(){
        var pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");
 
    //set push notifications handler
        document.addEventListener('push-notification', function(event) {
            var title = event.notification.title;
            var userData = event.notification.userdata;
            alert(JSON.stringify(event.notification));
            if(typeof(userData) != "undefined") {
                console.warn('user data: ' + JSON.stringify(userData));
            }

            alert(title);
        });

        //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_NUMBER", pw_appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
        pushNotification.onDeviceReady({ projectid: "602871635283", pw_appid : "222ED-BED0C" });

    },
    
    loadPage: function() {
        var $window = $(window);
        var $app = $('#application');
        var app = $app[0].contentWindow;
        var a = document.createElement('a');
        

        $window.on("message", function (e) {
            var data = e.originalEvent.data;
            switch (data.route) {
                case 'reload':
                    $window.scrollTop(0)
                    app.location.reload(true);
                    break;
                case 'scrollTop':
                    $window.scrollTop(0);
                    break;
                case 'update':
                    break;
                case 'open-url':
                    var url = data.url;
                    break;
                case 'push-registration':
//                    var pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");
//                    pushNotification.registerDevice(
//                        function(status) {
//                            var route = 'push-registrations/create/' + status['deviceToken'] + '/' + status['type'];
//                            app.postMessage({route: route}, '*');
//                        },
//                        function(status) {
//                            console.warn(JSON.stringify(['failed to register ', status]));
//                        }
//                    );
                    break;
                case 'push-registration/badge-clear':
                    break;
                case 'bar-codes/new':
                    alert('scan');
                        cordova.plugins.barcodeScanner.scan(function (result) { 

                            alert("We got a barcode\n" + 
                            "Result: " + result.text + "\n" + 
                            "Format: " + result.format + "\n" + 
                            "Cancelled: " + result.cancelled);  

                           console.log("Scanner result: \n" +
                                "text: " + result.text + "\n" +
                                "format: " + result.format + "\n" +
                                "cancelled: " + result.cancelled + "\n");
                            alert(result.text);
                            console.log(result);

                        }, function (error) { 
                            console.log("Scanning failed: ", error); 
                        } );
                    break;
            };
        });
    },
    onLoadHandler: function () {
        $('#loading-container').addClass('hidden');
    }

};