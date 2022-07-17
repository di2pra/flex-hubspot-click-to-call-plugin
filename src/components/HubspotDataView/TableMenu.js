import { Box, Input, Option, Select } from '@twilio-paste/core';
import React from 'react';
import { PAGE_SIZE_OPTIONS } from './constants';

function TableMenu({ dataState, setDataState }) {

  const onQueryChangeHandler = React.useCallback((event) => {

    event.preventDefault();

    setDataState(prevState => { return { ...prevState, after: 0, query: event.target.value } });
  }, [setDataState]);

  const onItemPerPageChangeHandler = React.useCallback((event) => {

    event.preventDefault();

    setDataState(prevState => { return { ...prevState, after: 0, limit: Number(event.target.value) } });
  }, [setDataState]);

  return (
    <Box display="flex" justifyContent="space-between" marginBottom="space40">
      <Box
        width="size40"
      >
        <Input
          aria-label="Search"
          type="text"
          placeholder="Search for a customer"
          value={dataState.query || ''}
          onChange={onQueryChangeHandler}
        />
      </Box>
      <Box>
        <Select id="items_per_page" value={dataState.limit} onChange={onItemPerPageChangeHandler}>
          {
            PAGE_SIZE_OPTIONS.map((item, index) => {
              return (<Option key={index} value={item}>{item}</Option>)
            })
          }
        </Select>
      </Box>
    </Box>
  )

}

export default TableMenu;