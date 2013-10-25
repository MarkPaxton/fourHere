/*
 * This is a component of HereApp that handles the photo popup dialog
 */
HereApp = HereApp || {};
HereApp.PhotoPopup = (function() {
  var photos = {};
  var popup = null;
  var currentPhoto = null;
  var photosReceived = function(data) {
    console.log(data);
    photos = data.response.photos;
    showPhoto(0);
  };
  var showPhoto = function(index) {
    if (photos.count > 0) {
      if (index < 0) {
        index = photos.count + index;
      }
      while (index >= photos.count) {
        index = index - photos.count;
      }
      if (photos.count == 1) {
        $("#photosNext").hide();
        $("#photosLast").hide();
      }
      var img = $(document.createElement("img"));
      img.attr("src", photos.items[index].prefix + "width300" + photos.items[index].suffix);
      currentPhoto = index;
      $("#photo").empty();
      $("#photo").append(img);
      $("#photosBottom").text((index + 1) + " of " + photos.count);
    }
    else {
      $("#photosBox").empty();
      $("#photosBox").text("No photos here yet.");
    }
  };
  var photosError = function(error) {
    console.log(error);
  };
  return {
    Initialise: function(component) {
      this.component = component;
    },
    Show: function(venue) {
      HereApp.FourSquareService.GetPhotosAt(venue.id, photosReceived, photosError);
      this.Close();
      var wrapper = $(document.createElement("div"));
      var content = $(document.createElement("div"));
      content.attr("id", "photosBox");
      wrapper.append(content);
      var name = $(document.createElement("p"));
      name.text(venue.name);
      var photos = $(document.createElement("div"));
      photos.attr("id", "photo");
      var photosNext = $(document.createElement("div"));
      photosNext.attr("id", "photosNext");
      photosNext.button({label: ">"});
      var photosLast = $(document.createElement("div"));
      photosLast.attr("id", "photosLast");
      photosLast.button({label: "<"});
      var bottomText = $(document.createElement("p"));
      bottomText.attr("id", "photosBottom");
      content.append([name, photosLast, photosNext, photos, bottomText]);
      popup = this.component.openBubble(wrapper.html(), venue.marker.coordinate);
      $("#photosNext").click(this.ShowNextPhoto);
      $("#photosLast").click(this.ShowLastPhoto);
    },
    ShowNextPhoto: function() {
      console.log("Next");
      showPhoto(currentPhoto + 1);
    },
    ShowLastPhoto: function() {
      console.log("Last");
      showPhoto(currentPhoto - 1);
    },
    /**
     * Close the open popup if open
     */
    Close: function() {
      if (popup !== null) {
        popup.close();
      }
    }
  };
})();

