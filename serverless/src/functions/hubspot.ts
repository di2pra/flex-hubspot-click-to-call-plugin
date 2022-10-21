import '@twilio-labs/serverless-runtime-types';
import { Context, ServerlessCallback } from '@twilio-labs/serverless-runtime-types/types';
import { functionValidator as FunctionTokenValidator } from 'twilio-flex-token-validator';
const fetch = require('node-fetch');

type MyEvent = {
  limit: string;
  after: string;
  query: string
}

type MyContext = {
}

// @ts-ignore
export const handler: ServerlessFunctionSignature<MyContext, MyEvent> = FunctionTokenValidator(async function (
  _: Context<MyContext>,
  event: MyEvent,
  callback: ServerlessCallback
) {

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

    if (!request.ok) {
      throw new Error('Error while retrieving data from hubspot');
    }

    const data = await request.json() as object;

    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

    response.appendHeader("Content-Type", "application/json");
    response.setBody(data);
    // Return a success response using the callback function.
    callback(null, response);


  } catch (err) {

    if (err instanceof Error) {
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
    } else {
      callback(null, {});
    }

  }
})