export enum ErrorCodes {
  SERVER_RESPONSE_ERROR = "SERVER_RESPONSE_ERROR",
  INVALID_DATAPACK_INFO = "INVALID_DATAPACK_INFO",
  INVALID_PRESET_INFO = "INVALID_PRESET_INFO",
  INVALID_PATTERN_INFO = "INVALID_PATTERN_INFO",
  INVALID_TIME_SCALE = "INVALID_TIME_SCALE",
  INVALID_DATAPACK_CONFIG = "INVALID_DATAPACK_CONFIG",
  INVALID_SVG_READY_RESPONSE = "INVALID_SVG_READY_RESPONSE",
  INVALID_SETTINGS_RESPONSE = "INVALID_SETTINGS_RESPONSE",
  INVALID_CHART_RESPONSE = "INVALID_CHART_RESPONSE",
  INVALID_PATH = "INVALID_PATH",
  INVALID_DATAPACK_UPLOAD = "INVALID_DATAPACK_UPLOAD",
  INVALID_USER_DATAPACKS = "INVALID_USER_DATAPACKS",
  INVALID_PUBLIC_DATAPACKS = "INVALID_PUBLIC_DATAPACKS",
  NO_DATAPACK_FILE_FOUND = "NO_DATAPACK_FILE_FOUND",
  DATAPACK_FILE_NAME_TOO_LONG = "DATAPACK_FILE_NAME_TOO_LONG",
  UNRECOGNIZED_DATAPACK_EXTENSION = "UNRECOGNIZED_DATAPACK_EXTENSION",
  UNRECOGNIZED_DATAPACK_FILE = "UNRECOGNIZED_DATAPACK_FILE",
  UNFINISHED_DATAPACK_UPLOAD_FORM = "UNFINISHED_DATAPACK_UPLOAD_FORM",
  DATAPACK_ALREADY_EXISTS = "DATAPACK_ALREADY_EXISTS",
  NO_DATAPACKS_SELECTED = "NO_DATAPACKS_SELECTED",
  NO_COLUMNS_SELECTED = "NO_COLUMNS_SELECTED",
  INVALID_MAPPACK_INFO = "INVALID_MAPPACK_INFO",
  IS_BAD_RANGE = "IS_BAD_RANGE",
  UNABLE_TO_LOGIN_SERVER = "UNABLE_TO_LOGIN_SERVER",
  UNABLE_TO_LOGIN_USERNAME_OR_PASSWORD = "UNABLE_TO_LOGIN_USERNAME_OR_PASSWORD",
  UNABLE_TO_LOGIN_GOOGLE_CREDENTIAL = "UNABLE_TO_LOGIN_GOOGLE_CREDENTIAL",
  UNABLE_TO_LOGIN_EXISTING_USER = "UNABLE_TO_LOGIN_EXISTING_USER",
  UNABLE_TO_LOGOUT = "UNABLE_TO_LOGOUT",
  UNABLE_TO_SIGNUP_SERVER = "UNABLE_TO_SIGNUP_SERVER",
  UNABLE_TO_SIGNUP_USERNAME_OR_EMAIL = "UNABLE_TO_SIGNUP_USERNAME_OR_EMAIL",
  INVALID_FORM = "INVALID_FORM",
  UNABLE_TO_VERIFY_ACCOUNT = "UNABLE_TO_VERIFY_ACCOUNT",
  UNABLE_TO_VERIFY_ACCOUNT_SERVER = "UNABLE_TO_VERIFY_ACCOUNT_SERVER",
  ALREADY_VERIFIED_ACCOUNT = "ALREADY_VERIFIED_ACCOUNT",
  TOKEN_EXPIRED_OR_INVALID = "SIGNUP_TOKEN_EXPIRED_OR_INVALID",
  UNABLE_TO_SEND_EMAIL = "UNABLE_TO_SEND_EMAIL",
  UNABLE_TO_RESET_PASSWORD = "UNABLE_TO_RESET_PASSWORD",
  UNABLE_TO_RESET_EMAIL = "UNABLE_TO_RESET_EMAIL",
  UNABLE_TO_LOGIN_ACCOUNT_LOCKED = "UNABLE_TO_LOGIN_ACCOUNT_LOCKED",
  UNABLE_TO_RECOVER_ACCOUNT = "UNABLE_TO_RECOVER_ACCOUNT",
  NOT_LOGGED_IN = "NOT_LOGGED_IN",
  USER_DATAPACK_FILE_NOT_FOUND_FOR_DOWNLOAD = "USER_DATAPACK_FILE_NOT_FOUND_FOR_DOWNLOAD",
  INCORRECT_ENCRYPTION_HEADER = "INCORRET_ENCRYPTION_HEADER",
  TOO_MANY_REQUESTS = "TOO_MANY_REQUESTS",
  RECAPTCHA_FAILED = "RECAPTCHA_FAILED",
  COOKIE_REJECTED = "COOKIE_REJECTED",
  UNRECOGNIZED_IMAGE_FILE = "UNRECOGNIZED_IMAGE_FILE",
  UPLOAD_PROFILE_PICTURE_FAILED = "UPLOAD_PROFILE_PICTURE_FAILED",
  UNABLE_TO_CHANGE_USERNAME = "UNABLE_TO_CHANGE_USERNAME",
  UNABLE_TO_DELETE_PROFILE = "UNABLE_TO_DELETE_PROFILE",
  INCORRECT_PASSWORD = "INCORRECT_PASSWORD",
  USERNAME_TAKEN = "USERNAME_TAKEN",
  UNABLE_TO_READ_FILE_OR_EMPTY_FILE = "UNABLE_TO_READ_FILE_OR_EMPTY_FILE",
  FETCH_USERS_FAILED = "FETCH_USERS_FAILED",
  ADMIN_ADD_USER_FAILED = "ADMIN_ADD_USER_FAILED",
  ADMIN_DELETE_USER_FAILED = "ADMIN_DELETE_USER_FAILED",
  SERVER_TIMEOUT = "SERVER_TIMEOUT",
  SERVER_BUSY = "SERVER_BUSY",
  UNABLE_TO_FETCH_USER_DATAPACKS = "UNABLE_TO_FETCH_USER_DATAPACKS",
  CANNOT_DELETE_ROOT_USER = "CANNOT_DELETE_ROOT_USER",
  ADMIN_DELETE_USER_DATAPACK_FAILED = "ADMIN_DELETE_USER_DATAPACK_FAILED",
  ADMIN_DELETE_SERVER_DATAPACK_FAILED = "ADMIN_DELETE_SERVER_DATAPACK_FAILED",
  ADMIN_CANNOT_DELETE_ROOT_DATAPACK = "ADMIN_CANNOT_DELETE_ROOT_DATAPACK",
  INVALID_SERVER_DATAPACK_REQUEST = "INVALID_SERVER_DATAPACK_REQUEST",
  SERVER_FILE_METADATA_ERROR = "SERVER_FILE_METADATA_ERROR",
  USER_DELETE_DATAPAACK_FAILED = "USER_DELETE_DATAPACK_FAILED",
  UNABLE_TO_PROCESS_DATAPACK_CONFIG = "UNABLE_TO_PROCESS_DATAPACK_CONFIG",
  INVALID_SETTINGS = "INVALID_SETTINGS",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  ADMIN_ADD_USERS_TO_WORKSHOP_FAILED = "ADMIN_ADD_USERS_TO_WORKSHOP_FAILED",
  ADMIN_EMAIL_INVALID = "ADMIN_EMAIL_INVALID",
  ADMIN_WORKSHOP_FIELDS_EMPTY = "ADMIN_WORKSHOP_FIELDS_EMPTY",
  UNRECOGNIZED_EXCEL_FILE = "UNRECOGNIZED_EXCEL_FILE",
  ADMIN_WORKSHOP_START_AFTER_END = "ADMIN_WORKSHOP_START_AFTER_END",
  SERVER_DATAPACK_ALREADY_EXISTS = "SERVER_DATAPACK_ALREADY_EXISTS",
  ADMIN_CREATE_WORKSHOP_FAILED = "ADMIN_CREATE_WORKSHOP_FAILED",
  ADMIN_WORKSHOP_ALREADY_EXISTS = "ADMIN_WORKSHOP_ALREADY_EXISTS",
  ADMIN_FETCH_WORKSHOPS_FAILED = "ADMIN_FETCH_WORKSHOPS_FAILED",
  ADMIN_WORKSHOP_NOT_FOUND = "ADMIN_WORKSHOP_NOT_FOUND"
}

export const ErrorMessages = {
  [ErrorCodes.SERVER_RESPONSE_ERROR]: "Server response error. Please try again later.",
  [ErrorCodes.INVALID_DATAPACK_INFO]: "Invalid datapack info received from server. Please try again later.",
  [ErrorCodes.INVALID_PRESET_INFO]: "Invalid preset info received from server. Please try again later.",
  [ErrorCodes.INVALID_PATTERN_INFO]: "Invalid pattern info received from server. Please try again later.",
  [ErrorCodes.INVALID_TIME_SCALE]: "Invalid time scale received from server. Please try again later.",
  [ErrorCodes.INVALID_DATAPACK_CONFIG]: "Datapacks were not properly set. Please try again later.",
  [ErrorCodes.INVALID_SVG_READY_RESPONSE]: "Invalid SVG ready response received from server. Please try again later.",
  [ErrorCodes.INVALID_SETTINGS_RESPONSE]: "Invalid settings response received from server. Please try again later.",
  [ErrorCodes.INVALID_CHART_RESPONSE]: "Invalid chart response received from server. Please try again later.",
  [ErrorCodes.INVALID_PATH]: "The requested path was invalid. Please ensure the path is correct.",
  [ErrorCodes.INVALID_DATAPACK_UPLOAD]: "Invalid datapack upload.",
  [ErrorCodes.INVALID_USER_DATAPACKS]: "Invalid user datapacks received from server. Please try again later.",
  [ErrorCodes.INVALID_PUBLIC_DATAPACKS]: "Invalid public datapacks received from server. Please try again later.",
  [ErrorCodes.NO_DATAPACK_FILE_FOUND]: "No datapack file found. Please upload a datapack file first.",
  [ErrorCodes.DATAPACK_FILE_NAME_TOO_LONG]: "Datapack file name is too long. Please shorten the file name.",
  [ErrorCodes.UNRECOGNIZED_DATAPACK_EXTENSION]:
    "Unrecognized datapack extension. File must be of type .dpk, .mdpk, .map, .txt. Please upload a valid datapack file.",
  [ErrorCodes.UNRECOGNIZED_DATAPACK_FILE]: "Unrecognized datapack file. Please upload a valid datapack file.",
  [ErrorCodes.UNFINISHED_DATAPACK_UPLOAD_FORM]:
    "Please finish the datapack upload form before attempting to upload the file.",
  [ErrorCodes.DATAPACK_ALREADY_EXISTS]: "Datapack already exists. Please upload a datapack with a unique title.",
  [ErrorCodes.NO_DATAPACKS_SELECTED]: "No datapacks selected. Please select at least one datapack to generate.",
  [ErrorCodes.NO_COLUMNS_SELECTED]: "No columns selected. Please select at least one column to generate.",
  [ErrorCodes.IS_BAD_RANGE]: "Base age must be greater than the top age.",
  [ErrorCodes.INVALID_MAPPACK_INFO]: "Invalid mappack info received from server. Please try again later.",
  [ErrorCodes.UNABLE_TO_LOGIN_SERVER]: "Unable to login due to server error. Please try again later.",
  [ErrorCodes.UNABLE_TO_LOGIN_GOOGLE_CREDENTIAL]: "Unable to login with Google credentials. Please try again.",
  [ErrorCodes.UNABLE_TO_LOGIN_USERNAME_OR_PASSWORD]: "Invalid username or password. Please try again.",
  [ErrorCodes.UNABLE_TO_LOGIN_EXISTING_USER]:
    "User with that email already exists. Please log in or sign up with a different email.",
  [ErrorCodes.UNABLE_TO_LOGOUT]: "Unable to logout. Please try again later.",
  [ErrorCodes.UNABLE_TO_SIGNUP_SERVER]: "Unable to sign up due to server error. Please try again later.",
  [ErrorCodes.UNABLE_TO_SIGNUP_USERNAME_OR_EMAIL]:
    "Email or username already exists. Please try again with a different email or username.",
  [ErrorCodes.INVALID_FORM]: "Invalid form. Please ensure all fields are filled out correctly.",
  [ErrorCodes.UNABLE_TO_VERIFY_ACCOUNT]:
    "Your email is not verified. Please verify your email first. If you did not receive an email, please resend.",
  [ErrorCodes.ALREADY_VERIFIED_ACCOUNT]: "Account is already verified. Please log in.",
  [ErrorCodes.UNABLE_TO_VERIFY_ACCOUNT_SERVER]: "Unable to verify account due to server error. Please try again later.",
  [ErrorCodes.TOKEN_EXPIRED_OR_INVALID]:
    "Your token is either invalid or has expired. Please request a new verification email.",
  [ErrorCodes.UNABLE_TO_SEND_EMAIL]: "Unable to send email. Please try again later.",
  [ErrorCodes.UNABLE_TO_RESET_PASSWORD]: "Unable to reset password. Please try again later.",
  [ErrorCodes.UNABLE_TO_RESET_EMAIL]: "Unable to reset email. Please try again later.",
  [ErrorCodes.UNABLE_TO_LOGIN_ACCOUNT_LOCKED]:
    "Your account has been locked. Please check your email for more information or contact support.",
  [ErrorCodes.UNABLE_TO_RECOVER_ACCOUNT]: "Unable to recover account. Please contact support for more information.",
  [ErrorCodes.NOT_LOGGED_IN]: "You are not logged in. Please log in to access this page.",
  [ErrorCodes.USER_DATAPACK_FILE_NOT_FOUND_FOR_DOWNLOAD]:
    "The datapack requested was not found on the server. Please try again later or contact our support team.",
  [ErrorCodes.INCORRECT_ENCRYPTION_HEADER]: "Unable to encrypt the file, please try again later.",
  [ErrorCodes.TOO_MANY_REQUESTS]: "You have made too many requests. Please try again later.",
  [ErrorCodes.RECAPTCHA_FAILED]: "Recaptcha failed. Please try again.",
  [ErrorCodes.COOKIE_REJECTED]: "You must accept cookies to sign in.",
  [ErrorCodes.UNRECOGNIZED_IMAGE_FILE]: "Unrecognized image extension. Please upload a valid image file.",
  [ErrorCodes.UPLOAD_PROFILE_PICTURE_FAILED]: "Unable to upload profile picture. Please try again later.",
  [ErrorCodes.UNABLE_TO_CHANGE_USERNAME]: "Unable to change username. Please try again later.",
  [ErrorCodes.UNABLE_TO_DELETE_PROFILE]: "Unable to delete profile. Please try again later.",
  [ErrorCodes.INCORRECT_PASSWORD]: "Incorrect password. Please try again.",
  [ErrorCodes.USERNAME_TAKEN]: "Username is already taken. Please try a different username.",
  [ErrorCodes.UNABLE_TO_READ_FILE_OR_EMPTY_FILE]: "Unable to read file or file is empty. Please try again.",
  [ErrorCodes.FETCH_USERS_FAILED]: "Unable to fetch users for admin display. Please try again later.",
  [ErrorCodes.ADMIN_ADD_USER_FAILED]: "Unable to add user. Please try again later.",
  [ErrorCodes.SERVER_TIMEOUT]: "Server timed out. Please try again later.",
  [ErrorCodes.SERVER_BUSY]: "Server is too busy. Please try again later.",
  [ErrorCodes.ADMIN_DELETE_USER_FAILED]: "Unable to delete user. Please try again later.",
  [ErrorCodes.UNABLE_TO_FETCH_USER_DATAPACKS]: "Unable to fetch user datapacks. Please try again later.",
  [ErrorCodes.CANNOT_DELETE_ROOT_USER]: "Cannot delete root user.",
  [ErrorCodes.ADMIN_DELETE_USER_DATAPACK_FAILED]: "Unable to delete user datapack. Please try again later.",
  [ErrorCodes.ADMIN_DELETE_SERVER_DATAPACK_FAILED]: "Unable to delete server datapack. Please try again later.",
  [ErrorCodes.ADMIN_CANNOT_DELETE_ROOT_DATAPACK]: "Cannot delete root datapack. Ask server admin for assistance.",
  [ErrorCodes.INVALID_SERVER_DATAPACK_REQUEST]: "Invalid server datapack request. Please try again later.",
  [ErrorCodes.SERVER_FILE_METADATA_ERROR]: "Server file metadata error. Please try again later.",
  [ErrorCodes.USER_DELETE_DATAPAACK_FAILED]: "Unable to delete user datapack. Please try again later.",
  [ErrorCodes.UNABLE_TO_PROCESS_DATAPACK_CONFIG]: "Failed to process datapack config. Please try again later.",
  [ErrorCodes.INVALID_SETTINGS]: "Invalid settings. Please try again.",
  [ErrorCodes.INTERNAL_ERROR]: "There was an internal error while generating the chart. Please try again later.",
  [ErrorCodes.ADMIN_ADD_USERS_TO_WORKSHOP_FAILED]: "Unable to add users to workshop. Please try again later.",
  [ErrorCodes.ADMIN_EMAIL_INVALID]: "Invalid email. Please fix the email and try again.",
  [ErrorCodes.ADMIN_WORKSHOP_FIELDS_EMPTY]: "You must provide at least one field to add users to a workshop.",
  [ErrorCodes.UNRECOGNIZED_EXCEL_FILE]: "Unrecognized Excel file. Please upload a valid Excel file.",
  [ErrorCodes.ADMIN_WORKSHOP_START_AFTER_END]: "The start date must be before the end date.",
  [ErrorCodes.SERVER_DATAPACK_ALREADY_EXISTS]:
    "Server datapack already exists. Please upload a unique datapack (different title).",
  [ErrorCodes.ADMIN_CREATE_WORKSHOP_FAILED]: "Unable to create workshop. Please try again later.",
  [ErrorCodes.ADMIN_WORKSHOP_ALREADY_EXISTS]: "Workshop with that title already exists. Please try a different title.",
  [ErrorCodes.ADMIN_FETCH_WORKSHOPS_FAILED]: "Unable to fetch workshops. Please try again later.",
  [ErrorCodes.ADMIN_WORKSHOP_NOT_FOUND]: "Workshop not found on server, it has likely ended or been deleted."
};
