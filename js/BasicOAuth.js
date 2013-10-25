/* 
 * Basic OAuth Object for use with Twitter API
 * @author Mark Paxton
 */

HereApp = HereApp || {};

/**
 * Set up the new BasicOAuth details
 */
HereApp.BasicOAuth = new function(consumerKey, accessToken, consumerSecret, accessTokenSecret) {
   this.consumerKey = consumerKey;
   this.accessToken = accessToken;
   // n.b. this is for demonstration purposes only and a full blown app would 
   // implement a sign-in process as desired by the end use case
   this.consumerSecret = consumerSecret;
   this.accessTokenSecret = accessTokenSecret;

this.protocol = null;
   this.url = null;
   this.params = null;

   

   this.Prepare = function(protocol, url, params) {
      this.protocol = protocol;
      this.url = url;
      this.params = params;
   };

   this.setParams = function(params) {
   };
   
   this.get

}

