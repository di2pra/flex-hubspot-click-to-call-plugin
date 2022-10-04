import { Button, DataGridCell, DataGridRow, Stack, useMenuState } from '@twilio-paste/core';
import { HelpText } from '@twilio-paste/core/Help-Text';
import { FaPhoneAlt, FaSms, FaWhatsapp } from 'react-icons/fa';
import { ICustomer } from '../../../../Types';

type Props = {
  data: ICustomer;
  actionDisabled: boolean;
  sendSmsHandler: (data: ICustomer) => void;
  sendWAHandler: (data: ICustomer) => void;
  initiateCallHandler: (data: ICustomer) => void;
}

const NULL_LABEL = "-";

function TableRow({ data, actionDisabled, sendSmsHandler, sendWAHandler, initiateCallHandler }: Props) {

  const menu = useMenuState();

  return (
    <DataGridRow>
      <DataGridCell>{data.firstname ? data.firstname : <HelpText>{NULL_LABEL}</HelpText>}</DataGridCell>
      <DataGridCell>{data.lastname ? data.lastname : <HelpText>{NULL_LABEL}</HelpText>}</DataGridCell>
      <DataGridCell>{data.email ? data.email : <HelpText>{NULL_LABEL}</HelpText>}</DataGridCell>
      <DataGridCell>{data.hs_calculated_phone_number ? data.hs_calculated_phone_number : <HelpText>{NULL_LABEL}</HelpText>}</DataGridCell>
      <DataGridCell>
        <Stack orientation="horizontal" spacing="space30" >
          <Button variant="primary" size="small" title={actionDisabled ? "To make a call, please change your status from 'Offline'" : "Make a call"} disabled={actionDisabled} onClick={() => initiateCallHandler(data)}><FaPhoneAlt /> Call</Button>
          <Button variant="primary" size="small" title={actionDisabled ? "To send a SMS, please change your status from 'Offline'" : "Send a SMS"} disabled={actionDisabled} onClick={() => sendSmsHandler(data)}><FaSms /> SMS</Button>
          <Button variant="primary" size="small" title={actionDisabled ? "To send a WhatsApp, please change your status from 'Offline'" : "Send a WhatsApp"} disabled={actionDisabled} onClick={() => sendWAHandler(data)}><FaWhatsapp /> WhatsApp</Button>
        </Stack>
      </DataGridCell>
    </DataGridRow>
  )
}

export default TableRow;