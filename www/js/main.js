function onLoadHandler() {
  $('#loading-container').addClass('hidden');
}

(function() {
  var $window = $(window);
  var $app = $('#application');
  var app = $app[0].contentWindow;
  var a = document.createElement('a');

  if (forge.cookiepolicy) {
    forge.cookiepolicy.alwaysAcceptCookies();
  };

  if (forge.reload) {
    forge.reload.updateAvailable(function (available) {
      if (available) {

        $('#upgrading-container').removeClass('hidden');
        $('#application').addClass('hidden');

        forge.reload.updateReady.addListener(function () {
          forge.reload.applyAndRestartApp();
        });

        forge.reload.update();
      }
    });
  };

  if (forge.pushwoosh) {
    forge.internal.addEventListener("pushwoosh.pushReceived",
      function (notification) {
        notification = JSON.parse(notification);

        if (notification.u) {
          var route, payload;
          payload = notification.u.custom;

          if (payload.meeting_id) {
            route = 'meetings/' + payload.meeting_id;
          } else if (payload.discussion_id) {
            route = 'discussions/' + payload.discussion_id;
          };

          if (route) app.postMessage({route: route}, '*');
          forge.pushwoosh.setApplicationIconBadgeNumber({badge:0});
        }
      }
    );
    forge.pushwoosh.onDeviceReady({"pw_appid":"222ED-BED0C", "gcm_id": "602871635283"});
  }

  if (forge.urlhandler) {
    forge.urlhandler.urlLoaded.addListener(function (request) {
      a.href = request.url;

      var token, route, dest;
      var parts = a.pathname.split('/')

      if (route = a.host) { // Safari puts "signin" in the host
        token = parts[1];
        dest = parts[2];
        dest = dest ? decodeURIComponent(dest) : '';
      } else {              // Chrome / Android returns host as ""
        route = parts[2];
        token = parts[3];
        dest = parts[4];
        dest = dest ? decodeURIComponent(dest) : '';
      }

      var origin = app.location.origin;
      var url = app.location.href;

      if (!origin || origin == 'null' || !url) {
        a.href = $app[0].src;
        origin = a.location.origin;
        url = a.location.href;
      };

      switch (route) {
        case 'reload': // ptbl://reload
          app.location.reload(true);
          break;
        case 'signin': // pathablegc2013://signin/authtoken1234/discussions%2F109534
          if (!token) {break;};

          dest = encodeURIComponent([url, dest].join('/'));

          app.location.href = origin +
            '/session?auth_token=' + token +
            '&dest=' + dest;
          break;
      }
    }, function (error) {
      alert(error);
    });
  };

  $window
    .on("message", function(e) {
      var data = e.originalEvent.data;

      switch (data.route) {
        case 'reload':
          $window.scrollTop(0)
          app.location.reload(true);
          if (forge.pushwoosh) {
            forge.pushwoosh.unregisterDevice();
          };
          break;
        case 'scrollTop':
          $window.scrollTop(0);
          break;
        case 'update':
          if (forge.reload) {
            forge.reload.update( function(){
              alert('Update started.');
            }, function(data) {
              alert('Update failed. ' + data.type + ': ' + data.message);
            });
          };
          break;
        case 'open-url':
          var url = data.url;
          if (forge.tabs) {
            forge.tabs.open(url
            , function(data) {
              // successful
            }
            , function(data) {
              alert('Failed to open URL. ' + data.type + ': ' + data.message);
            });
          };
          break;
        case 'push-registration':
          if (forge.pushwoosh) {
            forge.internal.addEventListener("pushwoosh.registrationSuccess",
              function (status) {
                var route = 'push-registrations/create/' + status['deviceToken'] + '/' + status['type'];
                app.postMessage({route: route}, '*');
              }
            );
            forge.pushwoosh.registerDevice();
          };
          break;
        case 'push-registration/badge-clear':
          if (forge.pushwoosh) {
            forge.pushwoosh.setApplicationIconBadgeNumber({badge:0});
          }
          break;
        case 'bar-codes/new':
          if (forge.barcode) {
            forge.barcode.scan(function (value) {
              var value = btoa(value);
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
            });
            break;
        };
      }
    })
})();
