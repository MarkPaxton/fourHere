/* 
 * Test spec for Twitter Stream Service Object
 */
describe("Here Maps demonstation", function() {
   describe("FourSquareService", function() {
      it("gets venues Near", function() {
         var result = null;
         var venuesReceived = function(data) {
            console.log(data);
            result = true;
         };
         var error = function(e) {
            console.log("error:");
            console.log(e);
            result = false;
         };
         var bbox = {
            bottomRight: {
               longitude: -1.3125, latitude: 50.8476
            },
            topLeft: {
               longitude: -1.5882, latitude: 50.9855
            }
         };
         runs(function() {
            HereApp.FourSquareService.Initialise("CS20EAK5TPSPGVDHDOGKSUMV21ZGWLHPH21U0T1XLIN055KP",
                    "Z2QB2BR52AMOFGLKEFTJ5WW2U2EJ5FDOMGRZ20AGVMQVWZMM");
            HereApp.FourSquareService.GetVenuesNear(bbox, venuesReceived, error);
         });

         waitsFor(function() {
            return result !== null;
         }, "FourSquare callback should call a callback", 5000);

         runs(function() {
            expect(result).toBe(true);
         });
      });

      it("gets photos for venue", function() {
         var result = null;
         var photosReceived = function(data) {
            console.log(data);
            result = true;
         };
         var error = function(e) {
            console.log("error:");
            console.log(e);
            result = false;
         };
         var venue_id = "43695300f964a5208c291fe3";
         runs(function() {
            HereApp.FourSquareService.Initialise("CS20EAK5TPSPGVDHDOGKSUMV21ZGWLHPH21U0T1XLIN055KP",
                    "Z2QB2BR52AMOFGLKEFTJ5WW2U2EJ5FDOMGRZ20AGVMQVWZMM");
            HereApp.FourSquareService.GetPhotosAt(venue_id, photosReceived, error);
         });

         waitsFor(function() {
            return result !== null;
         }, "FourSquare callback should call a callback", 5000);

         runs(function() {
            expect(result).toBe(true);
         });
      });
   });
});