import { DataGridCell, DataGridRow } from '@twilio-paste/core';
import { Box } from '@twilio-paste/core/Box';
import { Button } from '@twilio-paste/core/Button';
import { HelpText } from '@twilio-paste/core/Help-Text';
import { SMSCapableIcon } from "@twilio-paste/icons/esm/SMSCapableIcon";
import { VoiceCapableIcon } from "@twilio-paste/icons/esm/VoiceCapableIcon";
import { ICustomer } from '../../../../Types';

type Props = {
  data: ICustomer;
  actionDisabled: boolean;
  sendSmsHandler: (data: ICustomer) => void;
  sendWAHandler: (data: ICustomer) => void;
  initiateCallHandler: (data: ICustomer) => void;
}

function TableRow({ data, actionDisabled, sendSmsHandler, sendWAHandler, initiateCallHandler }: Props) {

  return (
    <DataGridRow>
      <DataGridCell>{data.firstname}</DataGridCell>
      <DataGridCell>{data.lastname}</DataGridCell>
      <DataGridCell>{data.email ? data.email : <HelpText>N/A</HelpText>}</DataGridCell>
      <DataGridCell>{data.hs_calculated_phone_number ? data.hs_calculated_phone_number : <HelpText>N/A</HelpText>}</DataGridCell>
      <DataGridCell>
        <Box display="flex" columnGap="space40">
          <Button variant='primary' disabled={actionDisabled} type="button" onClick={() => initiateCallHandler(data)}><VoiceCapableIcon decorative={false} title="Call the customer" /></Button>
          <Button variant='primary' disabled={actionDisabled} onClick={() => { sendSmsHandler(data) }}><SMSCapableIcon decorative={false} title="Send a Message to customer" /></Button>
          <Button variant='primary' disabled={actionDisabled} onClick={() => { sendWAHandler(data) }}><SMSCapableIcon decorative={false} title="Send a Whatsapp Message to customer" /></Button>
        </Box>
      </DataGridCell>
    </DataGridRow>
  )
}

export default TableRow;