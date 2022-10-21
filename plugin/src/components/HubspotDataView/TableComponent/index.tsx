import { DataGrid, DataGridHead, DataGridHeader, DataGridRow } from '@twilio-paste/core';
import { Box } from '@twilio-paste/core/box';
import * as Flex from "@twilio/flex-ui";
import { ICustomer, IHubspotResponse } from '../../../Types';
import TableBody from './TableBody';

export const TABLE_COLUMNS = [
  "First Name",
  "Last Name",
  "Email",
  "Phone Number",
  ""
]

type Props = {
  isLoading: boolean;
  data?: IHubspotResponse;
  manager: Flex.Manager;
  sendSmsHandler: (data: ICustomer) => void;
  sendWAHandler: (data: ICustomer) => void;
}

function TableComponent({ isLoading, data, manager, sendSmsHandler, sendWAHandler }: Props) {

  return (
    <Box>
      <DataGrid aria-label="Contact table" variant="default" tableLayout='fixed' striped>
        <DataGridHead>
          <DataGridRow>
            {
              TABLE_COLUMNS.map((item, key) => <DataGridHeader key={key}>{item}</DataGridHeader>)
            }
          </DataGridRow>
        </DataGridHead>
        <TableBody isLoading={isLoading} data={data} manager={manager} sendSmsHandler={sendSmsHandler} sendWAHandler={sendWAHandler} />
      </DataGrid>
    </Box>
  )
}

export default TableComponent;