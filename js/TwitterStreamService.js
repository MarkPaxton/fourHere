/* 
 * Twitter Stream Service
 * @author Mark Paxton, (c) 2013.
 */

// Define namespace if not defined
var HereApp = HereApp || {};
/**
 * A class to create a persistant http connection to the twitter streaming API service
 */
HereApp.TwitterStreamService = function(opencallback, datacallback, closecallback, errorcallback) {
  this.request = null;
  this.opencallback = opencallback;
  this.datacallback = datacallback;
  this.closecallback = closecallback;
  this.errorcallback = errorcallback;
  this.url = "https://stream.twitter.com/1.1/statuses/filter.json";
  this.consumerKey = "jSXoiditFkgvkfxDp5ZDg";
  this.accessToken = "204556352-QZR12YZnonuxNAFim8Tqs3i6B7aWVXOribMV4MLv";
  // n.b. this is for demonstration purposes only and a full blown app would 
  // implement a sign-in process as desired by the end use case
  this.consumerSecret = "zZk3qLya8bYSYjzpL0mmUSLNlk6TvUfXyULKptIkdc";
  this.accessTokenSecret = "gT4DYCjSLTlolAFP1AFYMQk0nsLQwIWyCtCVFWTVY";
  /**
   * Connect to the service
   */
  this.Connect = function(params) {
    if (this.request === null) {


      this.request = new XMLHttpRequest();
      this.request.timeout = 90;
      var headerString = this._signOAuthHeaders(this._populateOAuthHeaders(params));
      this.request.addEventListener("progress", this.datacallback);
      this.request.addEventListener("load", this.closecallback);
      this.request.addEventListener("error", this.errorcallback);
      this.request.addEventListener("abort", this.closecallback);
      this.request.addEventListener("readystatechange", function(e) {
        console.log(e);
      });
      var message = "";
      var keys = Object.keys(params);
      for (var i = 0, l = keys.length; i < l; i++) {
        if (i > 0) {
          message += "&";
        }
        message += params[encodeURIComponent(keys[i])] + "=" + encodeURIComponent(params[keys[i]]);
      }
      //this._getOptions(params);

      // Check if the XMLHttpRequest object has a "withCredentials" property.
      // "withCredentials" only exists on XMLHTTPRequest2 objects.
      if ("withCredentials" in this.request) {
        this.request.open("POST", this.url, true);
      } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        this.request = new XDomainRequest();
        this.request.open("POST", this.url);
      }
      else {
        console.log("not supported");
        return null;
      }
      this.request.setRequestHeader("Authorization", headerString);
      this.request.setRequestHeader('Cache-Control', 'no-cache');
      this.request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      this.request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      this.request.send(message);
    }
  };

  this._getOptions = function(params) {
    var r = new XMLHttpRequest();
    r.timeout = 90;
    var headerString = this._signOAuthHeaders(this._populateOAuthHeaders(params));
    r.addEventListener("progress", this.datacallback);
    r.addEventListener("load", this.closecallback);
    r.addEventListener("error", this.errorcallback);
    r.addEventListener("abort", this.closecallback);
    this.request.addEventListener("readystatechange", function(e) {
      console.log(e);
    });
    var message = "";
    var keys = Object.keys(params);
    for (var i = 0, l = keys.length; i < l; i++) {
      if (i > 0) {
        message += "&";
      }
      message += params[encodeURIComponent(keys[i])] + "=" + encodeURIComponent(params[keys[i]]);
    }
    r.open("OPTIONS", this.url);
    r.setRequestHeader("Authorization", headerString);
    r.send(message);

  };
  this._populateOAuthHeaders = function(params) {
    var random = Math.random().toString().replace(".", "");
    var headers = {
      oauth_consumer_key: this.consumerKey,
      oauth_timestamp: new Date().getTime(),
      oauth_nonce: "" + random,
      oauth_signature_method: "HMAC-SHA1",
      oauth_token: this.accessToken,
      oauth_version: 1.0
    };
    for (var k in params) {
      headers[k] = params[k];
    }
    return headers;
  };
  /**
   * Generates the oauth signature and adds signature header to headers
   */
  this._signOAuthHeaders = function(headers) {
    var keys = Object.keys(headers);
    var encodedHeaders = {};
    for (var i = 0, l = keys.length; i < l; i++) {
      encodedHeaders[encodeURIComponent(keys[i])] = encodeURIComponent(headers[keys[i]]);
    }

    keys = Object.keys(encodedHeaders);
    var sortedKeys = keys.sort();
    var headersString = "OAuth ";
    var headersSignatureString = "";
    var firstHeader = true;
    for (var i = 0, l = sortedKeys.length; i < l; i++) {
      if (i !== 0)
        headersSignatureString += "&";
      headersSignatureString += sortedKeys[i] + "=" + encodedHeaders[sortedKeys[i]];
      if (sortedKeys[i].indexOf("oauth_") === 0) {
        if (!firstHeader)
          headersString += ", ";
        else
          firstHeader = false;
        headersString += sortedKeys[i] + '="' + encodedHeaders[sortedKeys[i]] + '"';
      }
    }
    var signingKey = encodeURIComponent(this.consumerSecret) + "&" + encodeURIComponent(this.accessTokenSecret);
    var messageString = "HTTPS&" + encodeURIComponent(this.url) + "&" + encodeURIComponent(headersSignatureString);
    var signature = CryptoJS.HmacSHA1(messageString, signingKey).toString(CryptoJS.enc.Base64);
    headers.oauth_signature = signature;
    return headersString + ', oauth_signature="' + encodeURIComponent(signature) + '"';
  };
  /**
   * Disconnect from the service
   */
  this.Disconnect = function() {
    if (this.request !== null) {
      this.request.close();
    }
  };
  this.SendRequest = function(req) {
    this.send(req);
  };
};



