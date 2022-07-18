import { Alert, Box, Text } from '@twilio-paste/core';
import {
  Pagination, PaginationArrow, PaginationItems, PaginationLabel
} from '@twilio-paste/core/pagination';
import { DynamicContentStore } from "@twilio/flex-ui";
import React, { useState } from "react";
import useApi from '../../hooks/useApi';
import { PAGE_SIZE_OPTIONS } from './constants';
import SendSmsModal from './SendSmsModal';
import TableComponent from './TableComponent';
import TableMenu from './TableMenu';


export const displayName = "HubspotDataView";
export const contentStore = new DynamicContentStore(displayName);

const HubspotDataView = ({ manager }) => {

  const { getData } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();
  const [dataState, setDataState] = useState({
    limit: PAGE_SIZE_OPTIONS[0],
    after: 0,
    query: ''
  });
  const [selectedSmsContact, setSelectedSmsContact] = useState();

  React.useEffect(() => {

    setIsLoading(true);
    setData(undefined);

    getData(dataState)
      .then(data => setData(data))
      .catch(() => setError("Error while fetching data from Hubspot"))
      .finally(() => setIsLoading(false));

  }, [getData, dataState]);

  const sendSmsHandler = React.useCallback((data) => {
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
      <Box padding="space70">
        {
          error ? (
            <Box marginBottom="space60">
              <Alert variant='error'>
                <Text>{error}</Text>
              </Alert>
            </Box>
          ) : null
        }
        <TableMenu dataState={dataState} setDataState={setDataState} />
        <TableComponent isLoading={isLoading} data={data} manager={manager} sendSmsHandler={sendSmsHandler} />
        <Box display="flex" justifyContent="center" marginTop="space50">
          {
            isLoading ? null : (
              ((data && data.results) || []).length === 0 ? (
                <Pagination label="anchor pagination navigation">
                  <PaginationItems>
                    <PaginationLabel>0-0 of 0 contact</PaginationLabel>
                  </PaginationItems>
                </Pagination>
              ) : (
                <Pagination label="anchor pagination navigation">
                  <PaginationItems>
                    <PaginationArrow onClick={(e) => { e.preventDefault(); onPaginateHandler(dataState.after - dataState.limit); }} disabled={dataState.after === 0} as="button" label="Go to previous page" variant="back" />
                    <PaginationLabel>{dataState.after + 1}–{(dataState.after + dataState.limit > data.total) ? (data.total) : (dataState.after + dataState.limit)} of {data.total} contacts</PaginationLabel>
                    <PaginationArrow onClick={(e) => { e.preventDefault(); onPaginateHandler(dataState.after + dataState.limit); }} disabled={data && data.total <= (dataState.after + dataState.limit)} as="button" label="Go to next page" variant="forward" />
                  </PaginationItems>
                </Pagination>
              )
            )
          }
        </Box>
      </Box >
    </>
  );

}


export default HubspotDataView;