/* 
 * Test spec for Index Builder
 */
describe("Here Maps demonstation", function() {
  describe("IndexBuilder", function() {
    it("creates a new index", function() {
      var index = new HereApp.IndexBuilder();
      var count = 0;
      for (var k in index.venues) {
        count++;
      }
      expect(count).toEqual(0);
      count = 0;
      for (var k in index.categories) {
        count++;
      }
      expect(count).toEqual(0);
    });

    describe("using dummy data can", function() {
      var venue, index;

      beforeEach(function() {
        venue = {
          "id": "4b64336cf964a520cca32ae3", "name": "Southampton Central Railway Station (SOU)",
          "contact": {"phone": "+448457484950", "formattedPhone": "+44 845 748 4950", "twitter": "nationalrailenq"},
          "location": {"address": "Blechynden Tce", "lat": 50.907416977522665, "lng": -1.4136743545532227, "postalCode": "SO15 1AL",
            "cc": "GB", "city": "Southampton", "state": "Hampshire", "country": "United Kingdom"},
          "categories": [{"id": "4bf58dd8d48988d129951735", "name": "Train Station",
              "pluralName": "Train Stations", "shortName": "Train Station",
              "icon": {"prefix": "https:\/\/ss1.4sqi.net\/img\/categories_v2\/travel\/trainstation_",
                "suffix": ".png"}, "primary": true}],
          "verified": true,
          "restricted": true, "stats": {"checkinsCount": 15198, "usersCount": 3829, "tipCount": 58},
          "url": "http:\/\/www.nationalrail.co.uk\/stations\/sou\/details.html",
          "specials": {"count": 0, "items": []},
          "hereNow": {"count": 1, "groups": [{"type": "others", "name": "Other people here",
                "count": 1, "items": []}]}, "storeId": "SOU", "referralId": "v-1382608316"
        };
        index = new HereApp.IndexBuilder();
      });

      it("add a venue", function() {
        index.AddVenue(venue);

        expect(index.venues["4b64336cf964a520cca32ae3"]).toBe(venue);
        expect(index.categories["4bf58dd8d48988d129951735"].name).toBe("Train Stations");
        expect(index.categories["4bf58dd8d48988d129951735"].venues["4b64336cf964a520cca32ae3"]).toBe(true);

        var count = 0;
        for (k in index.venues) {
          count++;
          expect(k).toBe(venue.id);
        }
        expect(count).toBe(1);
      });

      it("get a venue", function() {
        index.AddVenue(venue);
        expect(index.GetVenue(venue.id)).toBe(venue);
      });

      it("return null on unknown venue", function() {
        var id = "4bf58dd8d48988d129951735";
        index.AddVenue(venue);
        expect(index.GetVenue(id)).toBe(null);
      });
    });
  });
});