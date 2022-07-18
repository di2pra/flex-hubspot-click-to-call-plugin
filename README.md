# Twilio Flex Hubspot Click-to-Call & Outbound SMS Plugin

A Twilio Flex Plugin to leverage your customer data from Hubspot and initiate an outbound call or an outbound SMS on Flex. This plugin uses the [Hubspot APIs](https://developers.hubspot.com/docs/api/overview) to retrieve your customer data from Hubspot. Twilio Serverless is used for the the backend.

![Screenshot of the Twilio Flex Hubspot Click-to-Call & Outbound SMS Plugin](screenshot.png "Screenshot of the Twilio Flex Hubspot Click-to-Call & Outbound SMS Plugin")

## Prerequisite

- Twilio Flex instance with Flex UI 2.0
- Twilio Phone Number
- Hubspot API Key is required to authenticate your API calls. [How to get your key?](https://knowledge.hubspot.com/integrations/how-do-i-get-my-hubspot-api-key)
- Twilio CLI tool with Flex Plugin and Serverless Plugin Extensions

Install the [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart) by running:
```bash
brew tap twilio/brew && brew install twilio
```

Then, install the [Flex Plugin extension](https://github.com/twilio-labs/plugin-flex/tree/v1-beta) for the Twilio CLI:
```bash
twilio plugins:install @twilio-labs/plugin-flex
```

Finally, install the [Serverless plugin extension](https://github.com/twilio-labs/plugin-serverless) for the Twilio CLI:
```bash
twilio plugins:install @twilio-labs/plugin-serverless
```

## Installation

First, you need to deploy the Twilio Serverless functions.

Move to the serverless folder and make a copy of the file .env.sample by running:
```bash
cd serverless
cp .env.sample .env
```

Update the .env with your values :
```bash
ACCOUNT_SID=
AUTH_TOKEN=
HUBSPOT_API_KEY=
INBOUND_SMS_STUDIO_FLOW=
TASK_ROUTER_WORKSPACE_SID=
TASK_ROUTER_WORKFLOW_SID=
TASK_ROUTER_QUEUE_SID=
TWILIO_PHONE_NUMBER=
```

Next, deploy the serverless functions by running:
```bash
twilio serverless:deploy
```

After the deployment, copy and keep the domain URL somewhere (example: `https://flex-hubspot-click-to-call-serverless-2'(8-xxx.twil.io`)

Now you need to deploy the plugin, move to the root folder, and make a copy of the .env.sample file by running:
```bash
cp .env.sample .env
```

Update the .env with your values :
```bash
FLEX_APP_TWILIO_SERVERLESS_DOMAIN=
```

Next, deploy the flex plugin by running:
```bash
twilio flex:plugins:deploy --changelog "ADD A CHANGELOG"
```

Finally, release the flex plugin by running:
```bash
twilio flex:plugins:release --plugin flex-hubspot-click-to-call-plugin@1.0.0 --name "NAME OF THE RELEASE" --description "DESCRIPTION OF THE RELEASE"
```

## Development

Run `twilio flex:plugins --help` to see all the commands we currently support. For further details on Flex Plugins refer to our documentation on the [Twilio Docs](https://www.twilio.com/docs/flex/developer/plugins/cli) page.