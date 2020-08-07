const client_id = "959981766504-9m4sm16bkc2572ki2umr4r86rmvpecdu.apps.googleusercontent.com";
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(client_id);

GoogleAuth = class {
  static loginUser(token, callback)
  {
    client.verifyIdToken({
      idToken: token,
      audience: client_id
    }).then((ticket) => {
      callback(ticket.getPayload());
    })
  }
}
