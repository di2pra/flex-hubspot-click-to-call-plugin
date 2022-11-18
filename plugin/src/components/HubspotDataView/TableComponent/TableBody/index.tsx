import { DataGridBody, DataGridCell, DataGridRow, SkeletonLoader, Text } from '@twilio-paste/core';
import { Box } from '@twilio-paste/core/box';
import * as Flex from "@twilio/flex-ui";
import { useCallback, useEffect, useState } from 'react';
import { TABLE_COLUMNS } from '..';
import { random } from '../../../../Helpers';
import { ICustomer, IHubspotResponse } from '../../../../Types';
import { PAGE_SIZE_OPTIONS } from '../../constants';
import TableRow from './TableRow';

type Props = {
  isLoading: boolean;
  data?: IHubspotResponse;
  manager: Flex.Manager;
  sendSmsHandler: (data: ICustomer) => void;
  sendWAHandler: (data: ICustomer) => void;
}

function TableBody({ isLoading, data, manager, sendSmsHandler, sendWAHandler }: Props) {

  const [actionDisabled, setActionDisabled] = useState(manager.workerClient ? !manager.workerClient.activity.available : true);

  const afterSetActivityListener = useCallback((payload) => {
    if (payload.activityAvailable) {
      setActionDisabled(false)
    } else {
      setActionDisabled(true)
    }
  }, []);

  const initiateCallHandler = useCallback((data: ICustomer) => {
    Flex.Actions.invokeAction("StartOutboundCall", {
      destination: data.hs_calculated_phone_number,
      taskAttributes: {
        name: `${data.firstname || ''} ${data.lastname || ''}`.trim(),
        hubspot_contact_id: data.hs_object_id
      }
    });
  }, []);

  useEffect(() => {
    Flex.Actions.addListener("afterSetActivity", afterSetActivityListener);

    return () => {
      Flex.Actions.removeListener("afterSetActivity", afterSetActivityListener)
    }
  }, [afterSetActivityListener])

  if (isLoading) {
    return (
      <DataGridBody>
        {
          Array(PAGE_SIZE_OPTIONS[0]).fill('').map((_, rowIndex) => {
            return (
              <DataGridRow key={rowIndex}>
                {
                  TABLE_COLUMNS.map((_, colIndex) => <DataGridCell key={colIndex}><SkeletonLoader width={`${random(50, 100)}%`} /></DataGridCell>)
                }
              </DataGridRow>
            )
          })
        }
      </DataGridBody>
    )
  }

  if (!data) {
    return (
      <DataGridBody>
        <DataGridRow>
          <DataGridCell colSpan={TABLE_COLUMNS.length}>
            <Box display="flex" justifyContent="center">
              <Text as="p">No Customer</Text>
            </Box>
          </DataGridCell>
        </DataGridRow>
      </DataGridBody>
    )
  }

  if (data.results.length === 0) {
    return (
      <DataGridBody>
        <DataGridRow>
          <DataGridCell colSpan={TABLE_COLUMNS.length}>
            <Box display="flex" justifyContent="center">
              <Text as="p">No Customer</Text>
            </Box>
          </DataGridCell>
        </DataGridRow>
      </DataGridBody>
    )
  }

  return (
    <DataGridBody>
      {
        data.results.map((item: any, key: number) => {
          return (<TableRow key={key} data={item.properties} actionDisabled={actionDisabled || !item.properties.hs_calculated_phone_number} sendSmsHandler={sendSmsHandler} sendWAHandler={sendWAHandler} initiateCallHandler={initiateCallHandler} />)
        })
      }
    </DataGridBody>
  )
}

export default TableBody;