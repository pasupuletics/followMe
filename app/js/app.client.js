//window.FM = window.FM || {socket: null, userType: null};

FM = {
  ioId: null,
  socket: null,
  initIO: function() {
    //var ioServer = document.location && document.location.origin;
    
    if(this.userType === 'share') {
      this.createIONameSpace();
/*      this.socket = io();
      this.socket.on('fm:connected', function(id) {
        this.ioId = id;
        this.createIONameSpace();
      }.bind(this));
*/    } else {
      this.socket = io(this.ioNameSpace);
      //this.getBuddiesList();
      /*this.socket.on('fm:locationSync', function(data){  
      }.bind(this));*/
      this.syncPosition();
    }
  },

  initMap: function(position) {
    this.initIO();
    this.markerImg = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
    this.mapNode = document.querySelector('#map');

    var myLatlng = this.getLatLng(position.coords);

    this.mapOptions = {
      zoom: 16,
      center: myLatlng
    };

    this.watchOptions = {
      enableHighAccuracy: true
    };

    this.map = new google.maps.Map(this.mapNode, this.mapOptions);

    this.marker = new google.maps.Marker({
      position: myLatlng,
      title: 'Title',
      label: 'A',
      animation: google.maps.Animation.DROP,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5
      }/*,
      icon: markerImg,
      draggable: true*/
    });

    this.marker.setMap(this.map);

    //listing to location change if @userType is `share`  
    /*if(this.userType === 'share') {
      //this.watchPosition();
    } else {
      this.syncPosition();
    }*/
  },

  syncPosition: function() {
    this.geoWatchPosition && this.clearWatch();
    this.socket.on('fm:locationSync', function(data) {
      this.setMarkerPosition(data);
    }.bind(this));
  },

  getLatLng: function(coords) {
    return new google.maps.LatLng(coords.latitude, coords.longitude);
  },

  setMarkerPosition: function(coords) {
    this.marker.setPosition(this.getLatLng(coords));
  },

  watchPosition: function() {
    this.geoWatchPosition = navigator.geolocation.watchPosition(
      function (position) {
        this.setMarkerPosition(position.coords);
        this.socket.emit('fm:locationChanged', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      }.bind(this),
      function() {
        console.error(arguments);
      },
      this.watchOptions
    );
  },

  clearWatch: function() {
    navigator.geolocation.clearWatch(this.geoWatchPosition);
  },

  createIONameSpace: function() {
    var _this = this;
    $.ajax({
      url: '/buddy',
      data: {id:this.ioId}
    }).done(function(res) {
      console.log(res);
      _this.ioNameSpace = res.nameSpace;
      _this.socket = io(_this.ioNameSpace);
      _this.watchPosition();
    }).fail(function(res) {
      console.error(res);
    });
  },

  getBuddiesList: function() {
    return $.ajax({
      url: '/buddies'
    });
  },

  init: function(type) {
    this.userType = type;
    navigator.geolocation.getCurrentPosition(function(position) {
      this.initMap(position);
    }.bind(this), function() {
      document.body.innerHTML = "Unable to retrieve your location";
    });
  }
};

window.FM = FM;
