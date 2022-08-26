import { DataGridCell, DataGridRow, MediaBody, MediaFigure, MediaObject, Menu, MenuButton, MenuItem, useMenuState } from '@twilio-paste/core';
import { HelpText } from '@twilio-paste/core/Help-Text';
import { ChevronDownIcon } from "@twilio-paste/icons/esm/ChevronDownIcon";
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
        <MenuButton {...menu} variant="primary" disabled={actionDisabled}>
          Actions<ChevronDownIcon decorative />
        </MenuButton>
        <Menu {...menu} aria-label="Actions">
          <MenuItem {...menu} disabled={actionDisabled} onClick={() => initiateCallHandler(data)}>
            <MediaObject verticalAlign="center">
              <MediaFigure spacing="space20">
                <FaPhoneAlt />
              </MediaFigure>
              <MediaBody>Phone Call</MediaBody>
            </MediaObject>
          </MenuItem>
          <MenuItem {...menu} disabled={actionDisabled} onClick={() => { sendSmsHandler(data) }}>
            <MediaObject verticalAlign="center">
              <MediaFigure spacing="space20">
                <FaSms />
              </MediaFigure>
              <MediaBody>SMS Message</MediaBody>
            </MediaObject>
          </MenuItem>
          <MenuItem {...menu} disabled={actionDisabled} onClick={() => { sendWAHandler(data) }}>
            <MediaObject verticalAlign="center">
              <MediaFigure spacing="space20">
                <FaWhatsapp />
              </MediaFigure>
              <MediaBody>WhatsApp Message</MediaBody>
            </MediaObject>
          </MenuItem>
        </Menu>
      </DataGridCell>
    </DataGridRow>
  )
}

export default TableRow;