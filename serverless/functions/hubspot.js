const TokenValidator = require("twilio-flex-token-validator").functionValidator;
const fetch = require('node-fetch');

const handlerFunction = async function (context, event, callback) {

  const {
    limit,
    after,
    query
  } = event;

  try {

    const request = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/search`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`
      },
      body: JSON.stringify({
        "after": after || 0,
        "limit": limit || 20,
        "properties": [
          "email",
          "firstname",
          "lastname",
          "hs_calculated_phone_number",
          "hubspot_owner_id"
        ],
        "sorts": [
          {
            "propertyName": "lastmodifieddate",
            "direction": "ASCENDING"
          }
        ],
        "query": query
      })
    });

    const data = await request.json();

    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

    response.appendHeader("Content-Type", "application/json");
    response.setBody(data);
    // Return a success response using the callback function.
    callback(null, response);


  } catch (err) {

    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

    response.appendHeader("Content-Type", "plain/text");
    response.setBody(err.message);
    response.setStatusCode(500);
    // If there's an error, send an error response
    // Keep using the response object for CORS purposes
    console.error(err);
    callback(null, response);
  }
}


exports.handler = process.env.NODE_ENV !== 'development' ? TokenValidator(handlerFunction) : handlerFunction;