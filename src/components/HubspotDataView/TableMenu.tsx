import { Button, Stack } from '@twilio-paste/core';
import { Box } from '@twilio-paste/core/Box';
import { Input } from '@twilio-paste/core/Input';
import { Option, Select } from '@twilio-paste/core/Select';
import { SearchIcon } from "@twilio-paste/icons/esm/SearchIcon";
import React, { useState } from 'react';
import { ITableDataState } from '../../Types';
import { PAGE_SIZE_OPTIONS } from './constants';

type Props = {
  dataState: ITableDataState;
  setDataState: React.Dispatch<React.SetStateAction<ITableDataState>>
}

function TableMenu({ dataState, setDataState }: Props) {

  const [currentSearchInputValue, setCurrentSearchInputValue] = useState<string>();

  const onQuerySubmit = React.useCallback((event) => {

    event.preventDefault();

    if (currentSearchInputValue) {
      setDataState(prevState => { return { ...prevState, after: 0, query: currentSearchInputValue } });
    }

  }, [setDataState, currentSearchInputValue]);

  const onItemPerPageChangeHandler = React.useCallback((event) => {

    event.preventDefault();

    setDataState(prevState => { return { ...prevState, after: 0, limit: Number(event.target.value) } });
  }, [setDataState]);

  const resetSearchInput = React.useCallback((event) => {

    event.preventDefault();
    setCurrentSearchInputValue(undefined);
    setDataState(prevState => { return { ...prevState, after: 0, query: '' } });

  }, [setDataState]);

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Box as="form" onSubmit={onQuerySubmit}>
          <Stack orientation="horizontal" spacing="space50">
            <Box width="size40">
              <Input
                aria-label="Search"
                type="text"
                placeholder="John Doe"
                value={currentSearchInputValue || ''}
                onChange={(e) => { setCurrentSearchInputValue(e.target.value) }}
                insertAfter={
                  <Button variant="link" type="submit">
                    <SearchIcon decorative={false} title="Search" />
                  </Button>
                }
              />
            </Box>
            {
              dataState.query != '' ? (
                <Button variant="destructive" type="button" onClick={resetSearchInput} >Reset</Button>
              ) : null
            }
          </Stack>
        </Box>
        <Box>
          <Select id="items_per_page" value={dataState.limit.toString()} onChange={onItemPerPageChangeHandler}>
            {
              PAGE_SIZE_OPTIONS.map((item, index) => {
                return (<Option key={index} value={item.toString()}>{item}</Option>)
              })
            }
          </Select>
        </Box>
      </Box>
    </>

  )

}

export default TableMenu;