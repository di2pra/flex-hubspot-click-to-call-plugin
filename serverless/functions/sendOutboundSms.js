const TokenValidator = require("twilio-flex-token-validator").functionValidator;

const openAChatTask = async (
  client,
  To,
  customerName,
  From,
  Body,
  WorkerFriendlyNameUriEncoded,
  routingProperties
) => {

  const interaction = await client.flexApi.v1.interaction.create({
    channel: {
      type: "sms",
      initiated_by: "agent",
      participants: [
        {
          address: To,
          proxy_address: From,
        },
      ],
    },
    routing: {
      properties: {
        ...routingProperties,
        task_channel_unique_name: "sms",
        attributes: {
          name: customerName,
          from: To,
          direction: "outbound",
          customerName: customerName,
          customerAddress: To,
          twilioNumber: From,
          channelType: "sms"
        },
      },
    },
  });

  const taskAttributes = JSON.parse(interaction.routing.properties.attributes);

  const message = await client.conversations
    .conversations(taskAttributes.conversationSid)
    .messages.create({ author: WorkerFriendlyNameUriEncoded, body: Body });

  return {
    success: true,
    interactionSid: interaction.sid,
    conversationSid: taskAttributes.conversationSid,
  };
};

const sendOutboundMessage = async (
  client,
  To,
  From,
  Body,
  KnownAgentRoutingFlag,
  WorkerFriendlyName,
  WorkerFriendlyNameUriEncoded,
  studioFlowSid
) => {
  const friendlyName = `Outbound ${From} -> ${To}`;

  // Set flag in channel attribtues so Studio knows if it should set task attribute to target known agent
  let converstationAttributes = { KnownAgentRoutingFlag };
  if (KnownAgentRoutingFlag)
    converstationAttributes.KnownAgentWorkerFriendlyName = WorkerFriendlyName;
  const attributes = JSON.stringify(converstationAttributes);

  // Create Channel
  const channel = await client.conversations.conversations.create({
    friendlyName,
    attributes
  });

  /*try {
    

  } catch (error) {

    if (error.code === 50416)
      return {
        success: false,
        errorMessage: `Error sending message. There is an open conversation already to ${To}`,
      };
    else
      return {
        success: false,
        errorMessage: `Error sending message. Error occured adding ${To} channel`,
      };
  }*/

  // Add customer to channel
  await client.conversations
    .conversations(channel.sid)
    .participants.create({
      "messagingBinding.address": To,
      "messagingBinding.proxyAddress": From,
    });

  // Point the channel to Studio
  const webhook = client.conversations
    .conversations(channel.sid)
    .webhooks.create({
      target: "studio",
      configuration: { flowSid: studioFlowSid },
    });

  // Add agents initial message
  await client.conversations
    .conversations(channel.sid)
    .messages.create({ author: WorkerFriendlyNameUriEncoded, body: Body });

  return { success: true, channelSid: channel.sid };
};


const handlerFunction = async function (context, event, callback) {

  const {
    To,
    From,
    Body,
    customerName,
    WorkerSid,
    WorkerFriendlyName
  } = event;

  let { OpenChatFlag, KnownAgentRoutingFlag } = event;

  const WorkerFriendlyNameUriEncoded = encodeURIComponent(WorkerFriendlyName).replace(/%/i, '_').replace(/\./i, '_2E');

  console.log(`KnownAgentRoutingFlag : ${KnownAgentRoutingFlag}`)

  const client = context.getTwilioClient();

  // Create a custom Twilio Response
  // Set the CORS headers to allow Flex to make an HTTP request to the Twilio Function
  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    let sendResponse = null;

    if (OpenChatFlag) {
      // create task and add the message to a channel
      sendResponse = await openAChatTask(
        client,
        To,
        customerName,
        From,
        Body,
        WorkerFriendlyNameUriEncoded,
        {
          workspace_sid: context.TASK_ROUTER_WORKSPACE_SID,
          workflow_sid: context.TASK_ROUTER_WORKFLOW_SID,
          queue_sid: context.TASK_ROUTER_QUEUE_SID,
          worker_sid: WorkerSid,
        }
      );
    } else {
      // create a channel but wait until customer replies before creating a task
      sendResponse = await sendOutboundMessage(
        client,
        To,
        From,
        Body,
        KnownAgentRoutingFlag,
        WorkerFriendlyName,
        WorkerFriendlyNameUriEncoded,
        context.INBOUND_SMS_STUDIO_FLOW
      );

    }

    response.appendHeader("Content-Type", "application/json");
    response.setBody(sendResponse);
    // Return a success response using the callback function.
    callback(null, response);
  } catch (err) {
    response.appendHeader("Content-Type", "plain/text");
    response.setBody(err.message);
    response.setStatusCode(500);
    // If there's an error, send an error response
    // Keep using the response object for CORS purposes
    callback(null, response);
  }
};


exports.handler = process.env.NODE_ENV !== 'development' ? TokenValidator(handlerFunction) : handlerFunction;