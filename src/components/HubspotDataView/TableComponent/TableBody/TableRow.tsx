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

function TableRow({ data, actionDisabled, sendSmsHandler, sendWAHandler, initiateCallHandler }: Props) {

  const menu = useMenuState();

  return (
    <DataGridRow>
      <DataGridCell>{data.firstname}</DataGridCell>
      <DataGridCell>{data.lastname}</DataGridCell>
      <DataGridCell>{data.email ? data.email : <HelpText>N/A</HelpText>}</DataGridCell>
      <DataGridCell>{data.hs_calculated_phone_number ? data.hs_calculated_phone_number : <HelpText>N/A</HelpText>}</DataGridCell>
      <DataGridCell>
        <Stack orientation="horizontal" spacing="space30" >
          <Button variant="primary" size="small" disabled={actionDisabled} onClick={() => initiateCallHandler(data)}><FaPhoneAlt /> Call</Button>
          <Button variant="primary" size="small" disabled={actionDisabled} onClick={() => sendSmsHandler(data)}><FaSms /> SMS</Button>
          <Button variant="primary" size="small" disabled={actionDisabled} onClick={() => sendWAHandler(data)}><FaWhatsapp /> WhatsApp</Button>
        </Stack>
      </DataGridCell>
    </DataGridRow>
  )
}

export default TableRow;