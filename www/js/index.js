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
        app.loadPage();
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },

    encode: function() {

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
                    break;
                case 'push-registration/badge-clear':
                    break;
                case 'bar-codes/new':
                    alert('scan');
                    if(cordova){
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
                            /*
                            if (args.format == "QR_CODE") {
                                window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
                            }
                            */

                        }, function (error) { 
                            console.log("Scanning failed: ", error); 
                        } );
                    }
                    break;
            };
        });
    },
    onLoadHandler: function () {
        $('#loading-container').addClass('hidden');
    }

};