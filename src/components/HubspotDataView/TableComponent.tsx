import { Box } from '@twilio-paste/core/box';
import { Spinner } from '@twilio-paste/core/spinner';
import { Table, TBody, Td, Th, THead, Tr } from '@twilio-paste/core/table';
import * as Flex from "@twilio/flex-ui";
import { useCallback, useEffect, useState } from 'react';
import TableRow from './TableRow';

type Props = {
  isLoading: boolean;
  data: any;
  manager: Flex.Manager;
  sendSmsHandler: (data: any) => void;
}

function TableComponent({ isLoading, data, manager, sendSmsHandler }: Props) {

  const [actionDisabled, setActionDisabled] = useState(manager.workerClient ? !manager.workerClient.activity.available : true);

  const afterSetActivityListener = useCallback((payload) => {
    if (payload.activityAvailable) {
      setActionDisabled(false)
    } else {
      setActionDisabled(true)
    }
  }, [])

  useEffect(() => {
    Flex.Actions.addListener("afterSetActivity", afterSetActivityListener);

    return () => {
      Flex.Actions.removeListener("afterSetActivity", afterSetActivityListener)
    }
  }, [afterSetActivityListener])

  return (
    <Box>
      <Table tableLayout="fixed" variant="default" striped>
        <THead>
          <Tr verticalAlign="middle">
            <Th>First Name</Th>
            <Th>Last Name</Th>
            <Th>Email</Th>
            <Th>Phone Number</Th>
            <Th>Actions</Th>
          </Tr>
        </THead>
        <TBody>
          {
            isLoading ? (
              <Tr>
                <Td colSpan={5}>
                  <Box display="flex" justifyContent="center">
                    <Spinner decorative size="sizeIcon100" title='Loading...' />
                  </Box>
                </Td>
              </Tr>
            ) : (
              data ? (
                (data.results || []).map((item: any, key: number) => {
                  return (<TableRow key={key} data={item.properties} actionDisabled={actionDisabled || !item.properties.hs_calculated_phone_number} sendSmsHandler={sendSmsHandler} />)
                })
              ) : (
                <Tr>
                  <Td colSpan={5}>
                    <Box display="flex" justifyContent="center">
                      <p>No data</p>
                    </Box>
                  </Td>
                </Tr>
              )
            )
          }
        </TBody>
      </Table>
    </Box>
  )
}

export default TableComponent;