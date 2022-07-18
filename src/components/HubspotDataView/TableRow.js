import { Box, Button, HelpText, Td, Tr } from '@twilio-paste/core';
import { SMSCapableIcon } from "@twilio-paste/icons/esm/SMSCapableIcon";
import { VoiceCapableIcon } from "@twilio-paste/icons/esm/VoiceCapableIcon";
import * as Flex from "@twilio/flex-ui";
import React from 'react';

function TableRow({ data, actionDisabled, sendSmsHandler }) {

  const initiateCallHandler = React.useCallback((phoneNumber) => {
    Flex.Actions.invokeAction("StartOutboundCall", {
      destination: phoneNumber,
      taskAttributes: {
        name: `${data.firstname || ''} ${data.lastname || ''}`.trim(),
        hubspot_contact_id: data.hs_object_id
      }
    });
  }, []);

  return (
    <Tr>
      <Td>{data.firstname}</Td>
      <Td>{data.lastname}</Td>
      <Td>{data.email ? data.email : <HelpText>N/A</HelpText>}</Td>
      <Td>{data.hs_calculated_phone_number ? data.hs_calculated_phone_number : <HelpText>N/A</HelpText>}</Td>
      <Td>
        <Box display="flex" columnGap="space40">
          <Button disabled={actionDisabled} type="button" onClick={() => initiateCallHandler(data.hs_calculated_phone_number)}><VoiceCapableIcon decorative={false} title="Call the customer" /></Button>
          <Button disabled={actionDisabled} onClick={() => { sendSmsHandler(data) }}><SMSCapableIcon decorative={false} title="Send a Message to customer" /></Button>
        </Box>
      </Td>
    </Tr>
  )
}

export default TableRow;