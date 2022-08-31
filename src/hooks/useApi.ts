import { useCallback } from "react";

const useApi = ({ token }: { token: string }) => {

  const getData = useCallback(async ({ limit, after, query }) => {

    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/hubspot`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        after,
        limit,
        query,
        Token: token
      })
    });

    return await request.json();

  }, [token]);

  const getTemplate = useCallback(async ({ hubspot_id }) => {

    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/template`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        hubspot_id,
        Token: token
      })
    });

    return await request.json();

  }, [token]);

  const soundOutboundMessage = useCallback(async ({ To, customerName, Body, WorkerFriendlyName, KnownAgentRoutingFlag, OpenChatFlag, hubspot_contact_id }) => {

    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/sendOutboundMessage`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        To,
        Body,
        customerName,
        WorkerFriendlyName,
        KnownAgentRoutingFlag,
        OpenChatFlag,
        hubspot_contact_id,
        Token: token
      })
    });

    return await request.json();

  }, [token]);



  return {
    getData,
    soundOutboundMessage,
    getTemplate
  }

}

export default useApi;