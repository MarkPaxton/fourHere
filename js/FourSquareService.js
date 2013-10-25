/* 
 * FourSquareService gets data from FourSquare
 */
HereApp = window.HereApp || {};

HereApp.FourSquareService = (function() {
   var url = 'https://api.foursquare.com/v2';
   var dateVerified = "20131024";
   var client_id = "";
   var client_secret = "";
  
   return {
      Initialise: function(id, secret) {
         client_id = id;
         client_secret = secret;
      },
      
      /**
       * Get a list of places to check into near the given ll and radius
       * @param {BoundingBox} geographic area to search
       * @param {function} callback to receive photos response object
       * @param {function} error handler       */
      GetVenuesNear: function(bbox, callback, error) {
         $.ajax({
            dataType: "json",
            url: url + "/venues/search",
            data: {
               sw: bbox.bottomRight.latitude + "," + bbox.topLeft.longitude,
               ne: bbox.topLeft.latitude + "," + bbox.bottomRight.longitude,
               intent: "browse",
               v: dateVerified,
               client_id: client_id,
               client_secret: client_secret
            },
            success: callback,
            error: error
         });
      },
   
   /**
       * Get a list of photos at a given venue id
       * @param {string} venue_id fourSquare venue to get photos at
       * @param {function} callback to receive photos response object
       * @param {function} error handler
       */
      GetPhotosAt: function(venue_id, callback, error) {
         $.ajax({
            dataType: "json",
            url: url + "/venues/" + venue_id + "/photos",
            data: {
               group: "venue",
               v: dateVerified,
               client_id: client_id,
               client_secret: client_secret
            },
            success: callback,
            error: error
         });
      }
   };
})();
