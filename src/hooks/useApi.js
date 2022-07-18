import { useCallback } from "react";

const useApi = ({ token }) => {

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

  const soundOutboundSms = useCallback(async ({ To, customerName, Body, WorkerFriendlyName, KnownAgentRoutingFlag, OpenChatFlag, WorkerSid }) => {

    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/sendOutboundSms`, {
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
        WorkerSid,
        Token: token
      })
    });

    return await request.json();

  }, [token]);

  return {
    getData,
    soundOutboundSms
  }

}

export default useApi;