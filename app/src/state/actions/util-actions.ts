import { pushError } from "./general-actions";
import { isServerResponseError } from "@tsconline/shared";

/**
 * Display error to dialog popup
 * @param error the error thrown
 * @param response the response from the server if applicable (nullable)
 * @param message the message to be shown
 */
export function displayServerError<T>(response: T | null, context: string, message: string) {
  if (!response) {
    pushError(context, message);
  } else if (isServerResponseError(response)) {
    console.log(`${message} with server response: ${response.error}`);
    pushError(context, response.error);
  } else {
    console.log(`${message} with server response: ${response}\n`);
    pushError(context, message);
  }
}
