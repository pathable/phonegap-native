var app = {
    pushNotification: null,
    // Application Constructor
    initialize: function () {
        navigator.splashscreen.show();
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        app.pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");
        app.initPushwoosh();
        app.loadPage();
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log('Received Event: ' + id);
    },
    encode: function () {

    },
    initPushwoosh: function () {

        //set push notifications handler
        document.addEventListener('push-notification', function (event) {
            var title = event.notification.title;
            var notification = JSON.parse(event.notification.title);

            if (notification.u) {
                var route, payload;
                payload = notification.u.custom;

                if (payload.meeting_id) {
                    route = 'meetings/' + payload.meeting_id;
                } else if (payload.discussion_id) {
                    route = 'discussions/' + payload.discussion_id;
                }
                ;

                if (route)
                    app.postMessage({route: route}, '*');
                app.pushNotification.setApplicationIconBadgeNumber(0);
            }
            alert(title);
        });

        //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_NUMBER", pw_appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
        app.pushNotification.onDeviceReady({projectid: "602871635283", pw_appid: "16D5D-FC32C"});

    },
    loadPage: function () {
        var $window = $(window);
        var $app = $('#application');
        var app = $app[0].contentWindow;
        var a = document.createElement('a');
        app.pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");

        $window.on("message", function (e) {
            var data = e.originalEvent.data;
            switch (data.route) {
                case 'reload':
                    $window.scrollTop(0)
                    app.location.reload(true);
                    if (app.pushNotification) {
                        app.pushNotification = null;
                    }
                    ;
                    break;
                case 'scrollTop':
                    $window.scrollTop(0);
                    break;
                case 'update':
                    break;
                case 'open-url':
                    var url = data.url;
                    var inapp = cordova.InAppBrowser.open(url, '_blank', 'location=no,toolbarposition=top,closebuttoncaption=Close');
//                    window.open = cordova.ThemeableBrowser.open();
                    break;
                case 'push-registration':

                    app.pushNotification.registerDevice(
                            function (status) {
                                var route = 'push-registrations/create/' + status['deviceToken'] + '/' + status['type'];
                                console.log("Registered for Push: ", route);
                                app.postMessage({route: route}, '*');
                            },
                            function (status) {
                                console.warn(JSON.stringify(['failed to register ', status]));
                            }
                    );
                    break;
                case 'push-registration/badge-clear':
                    app.pushNotification.setApplicationIconBadgeNumber(0);
                    break;
                case 'bar-codes/new':
                    cordova.plugins.barcodeScanner.scan(function (result) {
                        var value = btoa(result.text);
                        var organization_id = data.organization_id; // to create leads when user scans org
                        var user_id = data.user_id; // to create lead when organization scans user
                        var group_id = data.group_id; // communities or meetings, check in applied to memberships

                        if (organization_id) {
                            route = 'organizations/' + organization_id + '/bar-codes/' + value;
                        } else if (user_id) {
                            route = 'users/' + user_id + '/bar-codes/' + value;
                        } else if (group_id) {
                            route = 'groups/' + group_id + '/bar-codes/' + value;
                        } else {
                            route = 'bar-codes/' + value
                        };

                        app.postMessage({route: route}, '*');

                    }, function (error) {
                        console.log("Scanning failed: ", error);
                    });
                    break;
            }
            ;
        });
    },
    onLoadHandler: function () {
        $('#loading-container').addClass('hidden');
        setTimeout(function () {
            app.loadPage();
            navigator.splashscreen.hide();
        }, 2000);
    }
};
