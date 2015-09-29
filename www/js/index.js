function onLoadHandler() {
    $('#loading-container').addClass('hidden');
}

document.addEventListener("deviceready", init, false);

function init() {
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
                if(cordova){
                    cordova.plugins.barcodeScanner.scan(
                        function (result) {
                            alert(result.text);
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
                        },
                        function (error) {
                            alert("Scanning failed: " + error);
                        }
                    );
                }
                break;
        };
    });
}