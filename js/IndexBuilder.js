/* 
 * Index Builder - create an index of places on the map to display in the index
 * Uses data from fourSquare
 */
HereApp = HereApp || {};

HereApp.IndexBuilder = function() {
  this.categories = {};
  this.venues = {};
  /**
   * Add a venue to the index, if it's already in the index it will be updated
   * @param venue {FourSquare.venue} Foursquare Venue object to add
   * @returns {boolean} True if the item is new to the index
   */
  this.AddVenue = function(venue) {
    var newVenue = true;
    if (venue.id in this.venues) {
      newVenue = false;
      //Replace venue with new data but copy over the existing colour
      venue.colour = this.venues[venue.id].colour;
      this.RemoveVenue(venue.id);
    } else {
      venue.colour = this.createVenueColour(venue);
    }
    // Create an object with category ids as properties and anoter
    // object with category/venue_ids as properties to easily
    // check for existance
    for (var i = 0, l = venue.categories.length; i < l; i++) {
      var cat = venue.categories[i];
      if (!(cat.id in this.categories)) {
        this.categories[cat.id + ""] = {
          name: '', venues: {}
        };
      }
      //Ensure indexes are always a string
      this.categories[cat.id + ""].name = cat.pluralName;
      this.categories[cat.id + ""].venues[venue.id + ""] = true;
    }
    this.venues[venue.id + ""] = venue;
    venue.div = this.createVenueDiv(venue);
    venue.marker = this.createVenueMarker(venue);
    return newVenue;
  };

  /**
   * Remove a venue from the index
   * @param venue {FourSquare.venue} Foursquare Venue id to remove
   */
  this.RemoveVenue = function(venue_id) {
    if (venue_id in this.venues) {
      var venue = this.venues[venue_id];
      for (var i = 0, l = venue.categories.length; i < l; i++) {
        var cat = venue.categories[i];
        if (cat in this.categories) {
          if (venue_id in this.categories[cat]) {
            delete this.categories[cat].venues[venue_id];
          }
        }
      }
      delete this.venues[venue_id];
    }
  };
  /**
   * Get a venue from the list
   * @param venue_id {String} the ID of a venue from foursquare
   * @returns {Object} The venue object or null
   */
  this.GetVenue = function(venue_id) {
    var v = this.venues[venue_id];
    if (typeof v === 'undefined')
      v = null;
    return v;
  };

  this.createVenueColour = function(venue) {
    var colour = Math.round(Math.random() * 255) + ", " + Math.round(Math.random() * 255) + ", " + Math.round(Math.random() * 255);
    return colour;
  }
  ;

  this.createVenueDiv = function(venue) {
    var venueDiv = $(document.createElement("div"));
    venueDiv.attr("venueId", venue.id);
    venueDiv.addClass("venueDiv");
    venueDiv.css("background", "rgb( " + venue.colour + ")");
    var title = document.createElement("h1");
    $(title).html(venue.name);
    $(title).appendTo(venueDiv);
    return venueDiv;
  };

  this.createVenueMarker = function(venue) {
    return new nokia.maps.map.StandardMarker([venue.location.lat, venue.location.lng], {
      brush: {
        color: "rgb( " + venue.colour + ")"
      },
      pen: {
        strokeColor: "white",
        lineWidth: 6
      }
    });

  };

  this.GenerateList = function(container) {
    var target = container.children(".venueDivWrapper")[0];
    if (typeof target === "undefined") {
      target = $(document.createElement("div"));
      target.addClass("venueDivWrapper");
      container.append(target);
    } else {
      target = $(target);
    }
    var seenIds = [];
    var index = this;
    target.children(".venueDiv").each(function() {
      if (!($(this).attr("venueId") in index.venues)) {
        // $(this).effect("blind", "up");
        $(this).remove();
      }
      seenIds[$(this).attr("venueId")] = true;
    });
    for (var k in this.venues) {
      if (!(k in seenIds)) {
        //this.venues[k].div.effect("blind", "up");
        target.append(this.venues[k].div);
        //this.venues[k].div.effect("blind", "down");
      }
    }
  };
};
