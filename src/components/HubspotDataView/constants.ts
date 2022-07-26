export const PAGE_SIZE_OPTIONS = [10, 20, 30];

export const SEND_SMS_OPTION_VALUES = Object.freeze({
  SMS_TASK_AFTER_REPLY_ASSIGNED_TO_AGENT: "SMS_TASK_AFTER_REPLY_ASSIGNED_TO_AGENT",
  SMS_TASK_AFTER_REPLY: "SMS_TASK_AFTER_REPLY",
  TASK_AND_SMS: "TASK_AND_SMS"
});

export const SEND_SMS_OPTION_VALUES_LABEL = Object.freeze({
  SMS_TASK_AFTER_REPLY_ASSIGNED_TO_AGENT: "Send message and open chat with the customer when he replies (routed to me)",
  SMS_TASK_AFTER_REPLY: "Send message and open chat with the customer when he replies (routed to any agent)",
  TASK_AND_SMS: "Send message and open chat with the customer"
});