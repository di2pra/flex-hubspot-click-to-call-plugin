import { Alert, Box, Button, Input, Label, Option, Select, Text, TextArea } from '@twilio-paste/core';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import React, { useCallback, useState } from "react";
import useApi from '../../hooks/useApi';
import { SEND_SMS_OPTION_VALUES, SEND_SMS_OPTION_VALUES_LABEL } from './constants';

const MODAL_ID = "smsOutboundModal";

const SendSmsModal = ({ selectedSmsContact, handleClose, manager }) => {

  const { soundOutboundSms } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });
  const [option, setOption] = useState(Object.entries(SEND_SMS_OPTION_VALUES)[0]);
  const [message, setMessage] = useState();
  const [isProcessing, setIsProcessing] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [error, setError] = useState();

  const messageChangeHandler = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  const closeModal = useCallback(() => {
    setOption(Object.entries(SEND_SMS_OPTION_VALUES)[0]);
    setMessage(undefined);
    setError(undefined);
    setIsProcessing(false);
    setMessageSent(false);
    handleClose();
  }, [handleClose]);

  const onSubmitHandler = useCallback((event) => {
    event.preventDefault();

    setIsProcessing(true);

    soundOutboundSms({
      To: selectedSmsContact.hs_calculated_phone_number,
      customerName: `${selectedSmsContact.firstname || ''} ${selectedSmsContact.lastname || ''}`.trim(),
      From: '+15076074860',
      Body: message,
      WorkerFriendlyName: manager.workerClient.name,
      KnownAgentRoutingFlag: option === SEND_SMS_OPTION_VALUES.SMS_TASK_AFTER_REPLY_ASSIGNED_TO_AGENT,
      OpenChatFlag: option === SEND_SMS_OPTION_VALUES.TASK_AND_SMS,
      WorkerSid: manager.workerClient.sid
    })
      .then(() => setMessageSent(true))
      .catch(() => setError("Error while sending the SMS"))
      .finally(() => setIsProcessing(false));

  }, [selectedSmsContact, manager, message, option, soundOutboundSms]);

  const onOptionChangeHandler = useCallback((event) => {
    setOption(event.target.value);
  }, []);

  if (!selectedSmsContact) {
    return null;
  }

  if (messageSent) {
    return (
      <Modal size="wide" ariaLabelledby={MODAL_ID} isOpen onDismiss={closeModal}>
        <ModalHeader>
          <ModalHeading as="h3" id={MODAL_ID}>Send SMS to {selectedSmsContact.firstname} {selectedSmsContact.lastname}</ModalHeading>
        </ModalHeader>
        <Box as="form" onSubmit={onSubmitHandler}>
          <ModalBody>
            <Alert variant='neutral'>
              <Text>Message successfully sent to {selectedSmsContact.firstname} {selectedSmsContact.lastname}.</Text>
            </Alert>
          </ModalBody>
          <ModalFooter>
            <ModalFooterActions>
              <Button variant="secondary" type='button' onClick={closeModal}>Close</Button>
            </ModalFooterActions>
          </ModalFooter>
        </Box>
      </Modal>
    )
  }

  return (
    <Modal size="wide" ariaLabelledby={MODAL_ID} isOpen onDismiss={closeModal}>
      <ModalHeader>
        <ModalHeading as="h3" id={MODAL_ID}>Send SMS to {selectedSmsContact.firstname} {selectedSmsContact.lastname}</ModalHeading>
      </ModalHeader>
      <Box as="form" onSubmit={onSubmitHandler}>
        <ModalBody>
          {
            error ? (
              <Box marginBottom="space60">
                <Alert variant='error'>
                  <Text>{error}</Text>
                </Alert>
              </Box>
            ) : null
          }
          <Box marginBottom="space60">
            <Label htmlFor="outbound_option">Option</Label>
            <Select id="outbound_option" value={option} onChange={onOptionChangeHandler}>
              {Object.entries(SEND_SMS_OPTION_VALUES).map(([key, value], index) => {
                return (<Option key={index} value={key}>{SEND_SMS_OPTION_VALUES_LABEL[value]}</Option>)
              })}
            </Select>
          </Box>
          <Box marginBottom="space60">
            <Label htmlFor="phone_number" required>Phone Number</Label>
            <Input id="phone_number" name="phone_number" type="tel" disabled value={selectedSmsContact.hs_calculated_phone_number} required />
          </Box>
          <Label htmlFor="message" required>Message</Label>
          <TextArea value={message || ''} disabled={isProcessing} onChange={messageChangeHandler} id="message" name="message" required />
        </ModalBody>
        <ModalFooter>
          <ModalFooterActions>
            <Button variant="secondary" type='button' onClick={closeModal}>Cancel</Button>
            <Button variant="primary" type='submit' disabled={isProcessing}>{isProcessing ? 'Sending...' : 'Send'}</Button>
          </ModalFooterActions>
        </ModalFooter>
      </Box>
    </Modal>
  )
}

export default SendSmsModal;