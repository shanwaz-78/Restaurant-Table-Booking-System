export const formatResponse = (data, message = "Success", success = true) => ({
  success,
  message,
  data,
});
