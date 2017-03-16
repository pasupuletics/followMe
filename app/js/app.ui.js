$(function() {
  $('#user-type').on('click', 'label.btn', function(e) {
    var type = $(this).find('input').val();
    if(type === 'share') {
      FM.init(type);
    } else {
      FM.userType = type;

      FM.getBuddiesList().done(function(res) {
        var tmpl = '';
        $.each(res, function(key, val) {
          if(val) {
            tmpl += '<li><button type="button" class="btn btn-link" data-io-ns="' + key + '">' + key + '</button></li>'
          }
        });
        if(tmpl) {
          tmpl = '<ul class="fm-buddies-list">' + tmpl +'</ul>';
        } else {
          tmpl = '<p>No Buddies to follow.</>';
        }
        $("#myModal .modal-body").html(tmpl);
        //$(document.body).append('<ul>' + tmpl +'</ul>');
      }).fail(function(res) {
        console.error(res);
      });
    }
  });

  $('#myModal').on('click', '.fm-buddies-list .btn', function(e) {
    var ioNS = $(this).data('io-ns');
    FM.ioNameSpace = ioNS;
    $('#myModal').modal('toggle');
    FM.init(FM.userType);
  });
});
