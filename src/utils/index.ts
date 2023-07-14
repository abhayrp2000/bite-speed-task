import moment from "moment-timezone";

export const getLoggerFormatedDate = () => {
  return moment().toLocaleString();
};
