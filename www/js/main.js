function onLoadHandler() {
  $('#loading-container').addClass('hidden');
}

(function() {
  var $window = $(window);
  var $app = $('#application');
  var app = $app[0].contentWindow;
  var a = document.createElement('a');

  $window
    .on("message", function(e) {
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
            break;
        };
    });
})();
