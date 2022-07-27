import { Box } from '@twilio-paste/core/box';
import { Stack } from '@twilio-paste/core/stack';
import * as Flex from "@twilio/flex-ui";
import { DynamicContentStore } from "@twilio/flex-ui";
import React, { useState } from "react";
import useApi from '../../hooks/useApi';
import { ICustomer, IHubspotResponse, ITableDataState } from '../../Types';
import { PAGE_SIZE_OPTIONS } from './constants';
import SendSmsModal from './SendSmsModal';
import TableComponent from './TableComponent';
import TableErrorBox from './TableErrorBox';
import TableMenu from './TableMenu';
import TablePagination from './TablePagination';

export const displayName = "HubspotDataView";
export const contentStore = new DynamicContentStore(displayName);

const HubspotDataView = ({ manager }: { manager: Flex.Manager }) => {

  const { getData } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });

  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<IHubspotResponse>();
  const [dataState, setDataState] = useState<ITableDataState>({
    limit: PAGE_SIZE_OPTIONS[0],
    after: 0,
    query: ''
  });
  const [selectedSmsContact, setSelectedSmsContact] = useState<ICustomer>();

  React.useEffect(() => {

    setIsLoading(true);
    setData(undefined);
    setError(undefined);

    getData(dataState)
      .then(data => setData(data))
      .catch(() => setError("Error while fetching data from Hubspot"))
      .finally(() => setIsLoading(false));

  }, [getData, dataState]);

  const sendSmsHandler = React.useCallback((data: ICustomer) => {
    setSelectedSmsContact(data);
  }, []);


  const onPaginateHandler = React.useCallback((newAfter) => {
    setDataState(prevState => { return { ...prevState, after: newAfter } });
  }, []);

  const handleCloseModel = React.useCallback(() => {
    setSelectedSmsContact(undefined);
  }, []);

  return (
    <>
      <SendSmsModal selectedSmsContact={selectedSmsContact} manager={manager} handleClose={handleCloseModel} />
      <Box padding="space70" >
        <Stack orientation="vertical" spacing="space50">
          <TableErrorBox error={error} />
          <TableMenu dataState={dataState} setDataState={setDataState} />
          <TableComponent isLoading={isLoading} data={data} manager={manager} sendSmsHandler={sendSmsHandler} />
          <TablePagination isLoading={isLoading} data={data} dataState={dataState} onPaginateHandler={onPaginateHandler} />
        </Stack>
      </Box>
    </>
  );

}


export default HubspotDataView;