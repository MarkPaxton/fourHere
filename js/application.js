HereApp = HereApp || {};
HereApp.Start = function() {
  $(window).resize(function() {
    $('#mainContainer').width($(document).width() - $("#rightContainer").outerWidth(true) - 25);
    $('#mainContainer').height($(window).height() - $('#header').height() - $('#footer').height() - 15);
    $("#rightContainer").height($("#mainContainer").height());
  });
  $(window).resize();
  nokia.Settings.set("app_id", "ARwrvMV53UrhvW6WKy2N");
  nokia.Settings.set("app_code", "oXVAcFJ5MV6EDYTvCYpQIw");

  this.infoBubbles = new nokia.maps.map.component.InfoBubbles();

  var map = new nokia.maps.map.Display(
      document.getElementById("hereMap"), {
    // Zoom level for the map
    zoomLevel: 11,
    // Map center coordinates
    center: [50.9, -1.42],
    components: [
      new nokia.maps.map.component.Behavior(),
      new nokia.maps.map.component.ZoomBar(),
      new nokia.maps.map.component.Overview(),
      new nokia.maps.map.component.TypeSelector(),
      new nokia.maps.map.component.ScaleBar(),
      this.infoBubbles
    ]
  });

  this.selectedVenue = null;
  var selectVenue = (function(venue) {
    this.selectedVenue = venue;
    map.setCenter([venue.location.lat, venue.location.lng]);
    map.setZoomLevel(17);
    index.AddVenue(venue);
    HereApp.PhotoPopup.Show(venue);
  }).bind(this);

  var index = new HereApp.IndexBuilder();

  var highlightVenue = function(e) {
    $(e.data.div).css("background", "rgb(" + e.data.colour + ")");
    map.objects.remove(e.data.marker);
    map.objects.add(e.data.marker);
    e.data.marker.set("pen", {
      strokeColor: "black",
      lineWidth: 30
    });
    map.update(-1, 0);
  };

  var dehighlightVenue = function(e) {
    $(e.data.div).css("background", "rgba(" + e.data.colour + ", 0.6)");
    e.data.marker.set("pen", {
      strokeColor: "white",
      lineWidth: 3
    });
    map.update(-1, 0);
  };

  var updatePlaces = function(data) {
    var venues = data.response.venues;
    var oldKeys = {};
    for (k in index.venues) {
      oldKeys[k + ""] = true;
    }

    for (var i = 0, l = venues.length; i < l; i++) {
      var venue = venues[i];
      if (venue.id in oldKeys) {
        delete oldKeys[venue.id];
      }
      var newVenue = index.AddVenue(venue);
      if (newVenue) {
        map.objects.add(venue.marker);
        $(venue.div).click(venue, function(e) {
          selectVenue(e.data);
        });
        $(venue.div).mouseover(venue, highlightVenue);
        $(venue.div).mouseout(venue, dehighlightVenue);
        venue.marker.addListener("mouseover", (function(eVenue) {
          return function(e) {
            e.data = eVenue;
            highlightVenue(e);
            $('#rightContainer').scrollTo(eVenue.div);
          };
        })(venue), false);
        venue.marker.addListener("mouseout", (function(eVenue) {
          return function(e) {
            e.data = eVenue;
            dehighlightVenue(e);
          };
        })(venue), false);
        venue.marker.addListener("click", (function(eVenue) {
          return function(e) {
            e.data = eVenue;
            selectVenue(eVenue);
          };
        })(venue), false);
      }
    }
    // Remove old venues
    for (var k in oldKeys) {
      index.RemoveVenue(k);
    }

    if (selectedVenue !== null) {
      //Always make sure this is in the list in case the new search doesn't include it
      index.AddVenue(selectedVenue);
    }
    index.GenerateList($('#rightContainer'));
    $(window).resize();
  };
  var updatePlacesError = function(e) {
    console.log(e);
  };
  var lastMapMove = 0;
  var mapMove = function() {
    selectedVenue = null;
    var time = new Date().getTime();
    // Set a timeout so that the map is only updated when it hasn't moved for 1000 ticks
    // This prevents repeated calls to the external data source
    setTimeout(function() {
      if (time === lastMapMove) {
        var bbox = map.getViewBounds();
        HereApp.FourSquareService.GetVenuesNear(bbox, updatePlaces, updatePlacesError);
      }
    }, 1000);
    lastMapMove = time;
  };
  // Create a few shortcuts.

  HereApp.FourSquareService.Initialise(
      "CS20EAK5TPSPGVDHDOGKSUMV21ZGWLHPH21U0T1XLIN055KP",
      "Z2QB2BR52AMOFGLKEFTJ5WW2U2EJ5FDOMGRZ20AGVMQVWZMM");
  HereApp.PhotoPopup.Initialise(this.infoBubbles);
  map.addListener('mapviewchange', mapMove, false);
  mapMove();
};
$(function() {
  HereApp.Start();
});
