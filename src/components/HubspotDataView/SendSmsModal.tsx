import { Alert } from '@twilio-paste/core/Alert';
import { Box } from '@twilio-paste/core/Box';
import { Button } from '@twilio-paste/core/Button';
import { Input } from '@twilio-paste/core/Input';
import { Label } from '@twilio-paste/core/Label';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { Option, Select } from '@twilio-paste/core/Select';
import { Text } from '@twilio-paste/core/Text';
import { TextArea } from '@twilio-paste/core/TextArea';
import * as Flex from "@twilio/flex-ui";
import { useCallback, useState } from "react";
import useApi from '../../hooks/useApi';
import { SEND_SMS_OPTION } from './constants';

const MODAL_ID = "smsOutboundModal";

type Props = {
  selectedSmsContact: any,
  handleClose: () => void,
  manager: Flex.Manager
}

const SendSmsModal = ({ selectedSmsContact, handleClose, manager }: Props) => {

  const { soundOutboundSms } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });
  const [option, setOption] = useState(SEND_SMS_OPTION[0].value);
  const [message, setMessage] = useState<string>();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [messageSent, setMessageSent] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const messageChangeHandler = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  const closeModal = useCallback(() => {
    setOption(SEND_SMS_OPTION[0].value);
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
      Body: message,
      WorkerConversationIdentity: manager.conversationsClient ? manager.conversationsClient.user.identity : '',
      WorkerFriendlyName: manager.workerClient ? manager.workerClient.name : '',
      KnownAgentRoutingFlag: option === SEND_SMS_OPTION[0].value,
      OpenChatFlag: option === SEND_SMS_OPTION[2].value,
      WorkerSid: manager.workerClient ? manager.workerClient.sid : null
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
              <Text as="p">Message successfully sent to {selectedSmsContact.firstname} {selectedSmsContact.lastname}.</Text>
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
                  <Text as="p">{error}</Text>
                </Alert>
              </Box>
            ) : null
          }
          <Box marginBottom="space60">
            <Label htmlFor="outbound_option">Option</Label>
            <Select id="outbound_option" value={option} onChange={onOptionChangeHandler}>
              {SEND_SMS_OPTION.map((item, index) => {
                return (<Option key={index} value={item.value}>{item.label}</Option>)
              })}
            </Select>
          </Box>
          <Box marginBottom="space60">
            <Label htmlFor="phone_number" required>Phone Number</Label>
            <Input id="phone_number" name="phone_number" type="tel" disabled value={selectedSmsContact.hs_calculated_phone_number} required />
          </Box>
          <Label htmlFor="message" required>Message</Label>
          <TextArea value={message || ''} disabled={isProcessing} placeholder="Write your message here..." onChange={messageChangeHandler} id="message" name="message" required />
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