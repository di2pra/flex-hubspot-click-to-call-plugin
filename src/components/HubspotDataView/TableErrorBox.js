import { Alert } from '@twilio-paste/core/Alert';
import { Box } from '@twilio-paste/core/Box';
import { Text } from '@twilio-paste/core/Text';
import React from 'react';

function TableErrorBox({ error }) {

  if (!error) {
    return null;
  }

  return (
    <Box>
      <Alert variant='error'>
        <Text>{error}</Text>
      </Alert>
    </Box>
  )
}

export default TableErrorBox;