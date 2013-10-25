/* 
 * Test spec for Twitter Stream Service Object
 */
describe("Here Maps demonstation", function() {
  describe("TwitterStreamService", function() {
    it("constructs", function() {
      var open, close, error, message;
      open = function() {
      };
      close = function() {
      };
      error = function(error) {
      };
      message = function(m) {
      };
      var construct = function() {
        var service = new HereApp.TwitterStreamService(open, close, message, error);
      };
      expect(construct).not.toThrow();
    });

    /**
     * Basic functionallity that just uses a common setup procedure with basic callbacks
     */
    describe("", function() {
      var service, headers, open, close, error, message;
      beforeEach(function() {
        open = function() {
          console.log("Opened");
        };
        close = function() {
          console.log("Closed");
        };
        error = function(error) {
          console.log("error");
          console.log(error);
        };
        message = function(m) {
          console.log("message");
          console.log(m);
        };
        service = new HereApp.TwitterStreamService(open, close, message, error);
        headers = {
          locations: "-122.75,36.8,-121.75,37.8",
          include_entities: true
        };
      });

      it("generates reasonable unique nonce", function() {
        var seenNonces = {};
        for (var i = 0; i < 10000; i++) {
          headers = service._populateOAuthHeaders({
            locations: "-122.75,36.8,-121.75,37.8",
            include_entities: true
          });
          expect(headers.oauth_nonce in seenNonces).not.toBe(true);
          seenNonces[headers.oauth_nonce] = true;
        }
      });

      it("populates (unsigned) oAuth headers ", function() {
        var beforeTime = new Date().getTime();
        headers = service._populateOAuthHeaders({
          locations: "-122.75,36.8,-121.75,37.8",
          include_entities: true
        });
        var afterTime = new Date().getTime();

        expect(headers.oauth_consumer_key).toBe("jSXoiditFkgvkfxDp5ZDg");
        expect(headers.oauth_nonce).toBeDefined();
        expect(headers.oauth_signature).not.toBeDefined();
        expect(headers.oauth_signature_method).toBe("HMAC-SHA1");
        expect(headers.oauth_timestamp).not.toBeLessThan(beforeTime);
        expect(headers.oauth_timestamp).not.toBeGreaterThan(afterTime);
        expect(headers.oauth_token).toBe("204556352-QZR12YZnonuxNAFim8Tqs3i6B7aWVXOribMV4MLv");
        expect(headers.oauth_version).toBe(1.0);
      });

      it("signs oAuth headers", function() {
        headers = service._populateOAuthHeaders(headers);
        headers.oauth_timestamp = 1382456685973;
        headers.oauth_nonce = "09972094122786075";
        var signedString = service._signOAuthHeaders(headers);
        expect(signedString).toBe("OAuth " +
            'oauth_consumer_key="jSXoiditFkgvkfxDp5ZDg", oauth_nonce="09972094122786075", ' +
            'oauth_signature_method="HMAC-SHA1", oauth_timestamp="1382456685973", ' +
            'oauth_token="204556352-QZR12YZnonuxNAFim8Tqs3i6B7aWVXOribMV4MLv", oauth_version="1", ' +
            'oauth_signature="sFokVDobvGRDZh%2BMWAJyR42FMgQ%3D"'
            );
        expect('oauth_nonce' in headers).toBe(true);
        expect(headers.oauth_signature).toBe("sFokVDobvGRDZh+MWAJyR42FMgQ=");
      });
      
      it("connects", function() {
        service.Connect({
            locations: "-122.75,36.8,-121.75,37.8",
            include_entities: true
          });
      });
    });
  });
});