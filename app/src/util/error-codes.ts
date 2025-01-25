import i18n from "../../i18n";

export enum ErrorCodes {
  SERVER_RESPONSE_ERROR = "SERVER_RESPONSE_ERROR",
  INVALID_DATAPACK_INFO = "INVALID_DATAPACK_INFO",
  REGULAR_USER_UPLOAD_DATAPACK_TOO_LARGE = "REGULAR_USER_UPLOAD_DATAPACK_TOO_LARGE",
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
  UNABLE_TO_FETCH_DATAPACKS = "UNABLE_TO_FETCH_DATAPACKS",
  UNABLE_TO_FETCH_USER_DATAPACKS = "UNABLE_TO_FETCH_USER_DATAPACKS",
  CANNOT_DELETE_ROOT_USER = "CANNOT_DELETE_ROOT_USER",
  ADMIN_DELETE_USER_DATAPACK_FAILED = "ADMIN_DELETE_USER_DATAPACK_FAILED",
  ADMIN_DELETE_SERVER_DATAPACK_FAILED = "ADMIN_DELETE_SERVER_DATAPACK_FAILED",
  ADMIN_CANNOT_DELETE_ROOT_DATAPACK = "ADMIN_CANNOT_DELETE_ROOT_DATAPACK",
  INVALID_SERVER_DATAPACK_REQUEST = "INVALID_SERVER_DATAPACK_REQUEST",
  SERVER_FILE_METADATA_ERROR = "SERVER_FILE_METADATA_ERROR",
  USER_DELETE_DATAPACK_FAILED = "USER_DELETE_DATAPACK_FAILED",
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
  ADMIN_WORKSHOP_NOT_FOUND = "ADMIN_WORKSHOP_NOT_FOUND",
  ADMIN_WORKSHOP_EDIT_FAILED = "ADMIN_WORKSHOP_EDIT_FAILED",
  ADMIN_DELETE_WORKSHOP_FAILED = "ADMIN_DELETE_WORKSHOP_FAILED",
  USER_EDIT_DATAPACK_FAILED = "USER_EDIT_DATAPACK_FAILED",
  USER_FETCH_DATAPACK_FAILED = "USER_FETCH_DATAPACK_FAILED",
  ADMIN_FETCH_PRIVATE_DATAPACKS_FAILED = "ADMIN_FETCH_PRIVATE_DATAPACKS_FAILED",
  ADMIN_PRIORITY_BATCH_UPDATE_FAILED = "ADMIN_PRIORITY_BATCH_UPDATE_FAILED",
  USER_REPLACE_DATAPACK_FILE_FAILED = "USER_REPLACE_DATAPACK_FILE_FAILED",
  USER_REPLACE_DATAPACK_PROFILE_IMAGE_FAILED = "USER_REPLACE_DATAPACK_PROFILE_IMAGE_FAILED",
  DATAPACK_TITLE_LEADING_TRAILING_WHITESPACE = "DATAPACK_TITLE_LEADING_TRAILING_WHITESPACE",
  ADMIN_ADD_OFFICIAL_DATAPACK_TO_WORKSHOP_FAILED = "ADMIN_ADD_OFFICIAL_DATAPACK_TO_WORKSHOP_FAILED",
  ADMIN_SERVER_DATAPACK_ALREADY_EXISTS = "ADMIN_SERVER_DATAPACK_ALREADY_EXISTS",
  ADMIN_WORKSHOP_ENDED = "ADMIN_WORKSHOP_ENDED",
  ADMIN_ADD_FILES_TO_WORKSHOP_FAILED = "ADMIN_ADD_FILES_TO_WORKSHOP_FAILED",
  ADMIN_ADD_COVER_TO_WORKSHOP_FAILED = "ADMIN_ADD_COVER_TO_WORKSHOP_FAILED",
  INVALID_FILE_FORMAT = "INVALID_FILE_FORMAT",
  WORKSHOP_FETCH_DATAPACK_FAILED = "WORKSHOP_FETCH_DATAPACK_FAILED",
  METADATA_NOT_FOUND = "METADATA_NOT_FOUND"
}

export const ErrorMessages = {
  [ErrorCodes.SERVER_RESPONSE_ERROR]: i18n.t("errors.SERVER_RESPONSE_ERROR"),
  [ErrorCodes.INVALID_DATAPACK_INFO]: i18n.t("errors.INVALID_DATAPACK_INFO"),
  [ErrorCodes.INVALID_PRESET_INFO]: i18n.t("errors.INVALID_PRESET_INFO"),
  [ErrorCodes.INVALID_PATTERN_INFO]: i18n.t("errors.INVALID_PATTERN_INFO"),
  [ErrorCodes.INVALID_TIME_SCALE]: i18n.t("errors.INVALID_TIME_SCALE"),
  [ErrorCodes.INVALID_DATAPACK_CONFIG]: i18n.t("errors.INVALID_DATAPACK_CONFIG"),
  [ErrorCodes.INVALID_SVG_READY_RESPONSE]: i18n.t("errors.INVALID_SVG_READY_RESPONSE"),
  [ErrorCodes.INVALID_SETTINGS_RESPONSE]: i18n.t("errors.INVALID_SETTINGS_RESPONSE"),
  [ErrorCodes.INVALID_CHART_RESPONSE]: i18n.t("errors.INVALID_CHART_RESPONSE"),
  [ErrorCodes.INVALID_PATH]: i18n.t("errors.INVALID_PATH"),
  [ErrorCodes.INVALID_DATAPACK_UPLOAD]: i18n.t("errors.INVALID_DATAPACK_UPLOAD"),
  [ErrorCodes.REGULAR_USER_UPLOAD_DATAPACK_TOO_LARGE]: i18n.t("errors.REGULAR_USER_UPLOAD_DATAPACK_TOO_LARGE"),
  [ErrorCodes.INVALID_USER_DATAPACKS]: i18n.t("errors.INVALID_USER_DATAPACKS"),
  [ErrorCodes.INVALID_PUBLIC_DATAPACKS]: i18n.t("errors.INVALID_PUBLIC_DATAPACKS"),
  [ErrorCodes.NO_DATAPACK_FILE_FOUND]: i18n.t("errors.NO_DATAPACK_FILE_FOUND"),
  [ErrorCodes.DATAPACK_FILE_NAME_TOO_LONG]: i18n.t("errors.DATAPACK_FILE_NAME_TOO_LONG"),
  [ErrorCodes.UNRECOGNIZED_DATAPACK_EXTENSION]: i18n.t("errors.UNRECOGNIZED_DATAPACK_EXTENSION"),
  [ErrorCodes.UNRECOGNIZED_DATAPACK_FILE]: i18n.t("errors.UNRECOGNIZED_DATAPACK_FILE"),
  [ErrorCodes.UNFINISHED_DATAPACK_UPLOAD_FORM]: i18n.t("errors.UNFINISHED_DATAPACK_UPLOAD_FORM"),
  [ErrorCodes.DATAPACK_ALREADY_EXISTS]: i18n.t("errors.DATAPACK_ALREADY_EXISTS"),
  [ErrorCodes.NO_DATAPACKS_SELECTED]: i18n.t("errors.NO_DATAPACKS_SELECTED"),
  [ErrorCodes.NO_COLUMNS_SELECTED]: i18n.t("errors.NO_COLUMNS_SELECTED"),
  [ErrorCodes.IS_BAD_RANGE]: i18n.t("errors.IS_BAD_RANGE"),
  [ErrorCodes.INVALID_MAPPACK_INFO]: i18n.t("errors.INVALID_MAPPACK_INFO"),
  [ErrorCodes.UNABLE_TO_LOGIN_SERVER]: i18n.t("errors.UNABLE_TO_LOGIN_SERVER"),
  [ErrorCodes.UNABLE_TO_LOGIN_GOOGLE_CREDENTIAL]: i18n.t("errors.UNABLE_TO_LOGIN_GOOGLE_CREDENTIAL"),
  [ErrorCodes.UNABLE_TO_LOGIN_USERNAME_OR_PASSWORD]: i18n.t("errors.UNABLE_TO_LOGIN_USERNAME_OR_PASSWORD"),
  [ErrorCodes.UNABLE_TO_LOGIN_EXISTING_USER]: i18n.t("errors.UNABLE_TO_LOGIN_EXISTING_USER"),
  [ErrorCodes.UNABLE_TO_LOGOUT]: i18n.t("errors.UNABLE_TO_LOGOUT"),
  [ErrorCodes.UNABLE_TO_SIGNUP_SERVER]: i18n.t("errors.UNABLE_TO_SIGNUP_SERVER"),
  [ErrorCodes.UNABLE_TO_SIGNUP_USERNAME_OR_EMAIL]: i18n.t("errors.UNABLE_TO_SIGNUP_USERNAME_OR_EMAIL"),
  [ErrorCodes.INVALID_FORM]: i18n.t("errors.INVALID_FORM"),
  [ErrorCodes.UNABLE_TO_VERIFY_ACCOUNT]: i18n.t("errors.UNABLE_TO_VERIFY_ACCOUNT"),
  [ErrorCodes.ALREADY_VERIFIED_ACCOUNT]: i18n.t("errors.ALREADY_VERIFIED_ACCOUNT"),
  [ErrorCodes.UNABLE_TO_VERIFY_ACCOUNT_SERVER]: i18n.t("errors.UNABLE_TO_VERIFY_ACCOUNT_SERVER"),
  [ErrorCodes.TOKEN_EXPIRED_OR_INVALID]: i18n.t("errors.TOKEN_EXPIRED_OR_INVALID"),
  [ErrorCodes.UNABLE_TO_SEND_EMAIL]: i18n.t("errors.UNABLE_TO_SEND_EMAIL"),
  [ErrorCodes.UNABLE_TO_RESET_PASSWORD]: i18n.t("errors.UNABLE_TO_RESET_PASSWORD"),
  [ErrorCodes.UNABLE_TO_RESET_EMAIL]: i18n.t("errors.UNABLE_TO_RESET_EMAIL"),
  [ErrorCodes.UNABLE_TO_LOGIN_ACCOUNT_LOCKED]: i18n.t("errors.UNABLE_TO_LOGIN_ACCOUNT_LOCKED"),
  [ErrorCodes.UNABLE_TO_RECOVER_ACCOUNT]: i18n.t("errors.UNABLE_TO_RECOVER_ACCOUNT"),
  [ErrorCodes.NOT_LOGGED_IN]: i18n.t("errors.NOT_LOGGED_IN"),
  [ErrorCodes.USER_DATAPACK_FILE_NOT_FOUND_FOR_DOWNLOAD]: i18n.t("errors.USER_DATAPACK_FILE_NOT_FOUND_FOR_DOWNLOAD"),
  [ErrorCodes.INCORRECT_ENCRYPTION_HEADER]: i18n.t("errors.INCORRECT_ENCRYPTION_HEADER"),
  [ErrorCodes.TOO_MANY_REQUESTS]: i18n.t("errors.TOO_MANY_REQUESTS"),
  [ErrorCodes.RECAPTCHA_FAILED]: i18n.t("errors.RECAPTCHA_FAILED"),
  [ErrorCodes.COOKIE_REJECTED]: i18n.t("errors.COOKIE_REJECTED"),
  [ErrorCodes.UNRECOGNIZED_IMAGE_FILE]: i18n.t("errors.UNRECOGNIZED_IMAGE_FILE"),
  [ErrorCodes.UPLOAD_PROFILE_PICTURE_FAILED]: i18n.t("errors.UPLOAD_PROFILE_PICTURE_FAILED"),
  [ErrorCodes.UNABLE_TO_CHANGE_USERNAME]: i18n.t("errors.UNABLE_TO_CHANGE_USERNAME"),
  [ErrorCodes.UNABLE_TO_DELETE_PROFILE]: i18n.t("errors.UNABLE_TO_DELETE_PROFILE"),
  [ErrorCodes.INCORRECT_PASSWORD]: i18n.t("errors.INCORRECT_PASSWORD"),
  [ErrorCodes.USERNAME_TAKEN]: i18n.t("errors.USERNAME_TAKEN"),
  [ErrorCodes.UNABLE_TO_READ_FILE_OR_EMPTY_FILE]: i18n.t("errors.UNABLE_TO_READ_FILE_OR_EMPTY_FILE"),
  [ErrorCodes.FETCH_USERS_FAILED]: i18n.t("errors.FETCH_USERS_FAILED"),
  [ErrorCodes.ADMIN_ADD_USER_FAILED]: i18n.t("errors.ADMIN_ADD_USER_FAILED"),
  [ErrorCodes.SERVER_TIMEOUT]: i18n.t("errors.SERVER_TIMEOUT"),
  [ErrorCodes.SERVER_BUSY]: i18n.t("errors.SERVER_BUSY"),
  [ErrorCodes.ADMIN_DELETE_USER_FAILED]: i18n.t("errors.ADMIN_DELETE_USER_FAILED"),
  [ErrorCodes.UNABLE_TO_FETCH_DATAPACKS]: i18n.t("errors.UNABLE_TO_FETCH_DATAPACKS"),
  [ErrorCodes.UNABLE_TO_FETCH_USER_DATAPACKS]: i18n.t("errors.UNABLE_TO_FETCH_USER_DATAPACKS"),
  [ErrorCodes.CANNOT_DELETE_ROOT_USER]: i18n.t("errors.CANNOT_DELETE_ROOT_USER"),
  [ErrorCodes.ADMIN_DELETE_USER_DATAPACK_FAILED]: i18n.t("errors.ADMIN_DELETE_USER_DATAPACK_FAILED"),
  [ErrorCodes.ADMIN_DELETE_SERVER_DATAPACK_FAILED]: i18n.t("errors.ADMIN_DELETE_SERVER_DATAPACK_FAILED"),
  [ErrorCodes.ADMIN_CANNOT_DELETE_ROOT_DATAPACK]: i18n.t("errors.ADMIN_CANNOT_DELETE_ROOT_DATAPACK"),
  [ErrorCodes.INVALID_SERVER_DATAPACK_REQUEST]: i18n.t("errors.INVALID_SERVER_DATAPACK_REQUEST"),
  [ErrorCodes.SERVER_FILE_METADATA_ERROR]: i18n.t("errors.SERVER_FILE_METADATA_ERROR"),
  [ErrorCodes.USER_DELETE_DATAPACK_FAILED]: i18n.t("errors.USER_DELETE_DATAPACK_FAILED"),
  [ErrorCodes.UNABLE_TO_PROCESS_DATAPACK_CONFIG]: i18n.t("errors.UNABLE_TO_PROCESS_DATAPACK_CONFIG"),
  [ErrorCodes.INVALID_SETTINGS]: i18n.t("errors.INVALID_SETTINGS"),
  [ErrorCodes.INTERNAL_ERROR]: i18n.t("errors.INTERNAL_ERROR"),
  [ErrorCodes.ADMIN_ADD_USERS_TO_WORKSHOP_FAILED]: i18n.t("errors.ADMIN_ADD_USERS_TO_WORKSHOP_FAILED"),
  [ErrorCodes.ADMIN_EMAIL_INVALID]: i18n.t("errors.ADMIN_EMAIL_INVALID"),
  [ErrorCodes.ADMIN_WORKSHOP_FIELDS_EMPTY]: i18n.t("errors.ADMIN_WORKSHOP_FIELDS_EMPTY"),
  [ErrorCodes.UNRECOGNIZED_EXCEL_FILE]: i18n.t("errors.UNRECOGNIZED_EXCEL_FILE"),
  [ErrorCodes.ADMIN_WORKSHOP_START_AFTER_END]: i18n.t("errors.ADMIN_WORKSHOP_START_AFTER_END"),
  [ErrorCodes.SERVER_DATAPACK_ALREADY_EXISTS]: i18n.t("errors.SERVER_DATAPACK_ALREADY_EXISTS"),
  [ErrorCodes.ADMIN_CREATE_WORKSHOP_FAILED]: i18n.t("errors.ADMIN_CREATE_WORKSHOP_FAILED"),
  [ErrorCodes.ADMIN_WORKSHOP_ALREADY_EXISTS]: i18n.t("errors.ADMIN_WORKSHOP_ALREADY_EXISTS"),
  [ErrorCodes.ADMIN_FETCH_WORKSHOPS_FAILED]: i18n.t("errors.ADMIN_FETCH_WORKSHOPS_FAILED"),
  [ErrorCodes.ADMIN_WORKSHOP_NOT_FOUND]: i18n.t("errors.ADMIN_WORKSHOP_NOT_FOUND"),
  [ErrorCodes.ADMIN_WORKSHOP_EDIT_FAILED]: i18n.t("errors.ADMIN_WORKSHOP_EDIT_FAILED"),
  [ErrorCodes.ADMIN_DELETE_WORKSHOP_FAILED]: i18n.t("errors.ADMIN_DELETE_WORKSHOP_FAILED"),
  [ErrorCodes.USER_EDIT_DATAPACK_FAILED]: i18n.t("errors.USER_EDIT_DATAPACK_FAILED"),
  [ErrorCodes.USER_FETCH_DATAPACK_FAILED]: i18n.t("errors.USER_FETCH_DATAPACK_FAILED"),
  [ErrorCodes.ADMIN_FETCH_PRIVATE_DATAPACKS_FAILED]: i18n.t("errors.ADMIN_FETCH_PRIVATE_DATAPACKS_FAILED"),
  [ErrorCodes.ADMIN_PRIORITY_BATCH_UPDATE_FAILED]: i18n.t("errors.ADMIN_PRIORITY_BATCH_UPDATE_FAILED"),
  [ErrorCodes.USER_REPLACE_DATAPACK_FILE_FAILED]: i18n.t("errors.USER_REPLACE_DATAPACK_FILE_FAILED"),
  [ErrorCodes.USER_REPLACE_DATAPACK_PROFILE_IMAGE_FAILED]: i18n.t("errors.USER_REPLACE_DATAPACK_PROFILE_IMAGE_FAILED"),
  [ErrorCodes.DATAPACK_TITLE_LEADING_TRAILING_WHITESPACE]: i18n.t("errors.DATAPACK_TITLE_LEADING_TRAILING_WHITESPACE"),
  [ErrorCodes.ADMIN_ADD_OFFICIAL_DATAPACK_TO_WORKSHOP_FAILED]: i18n.t(
    "errors.ADMIN_ADD_OFFICIAL_DATAPACK_TO_WORKSHOP_FAILED"
  ),
  [ErrorCodes.ADMIN_SERVER_DATAPACK_ALREADY_EXISTS]: i18n.t("errors.ADMIN_SERVER_DATAPACK_ALREADY_EXISTS"),
  [ErrorCodes.ADMIN_WORKSHOP_ENDED]: i18n.t("errors.ADMIN_WORKSHOP_ENDED"),
  [ErrorCodes.ADMIN_ADD_FILES_TO_WORKSHOP_FAILED]: i18n.t("errors.ADMIN_ADD_FILES_TO_WORKSHOP_FAILED"),
  [ErrorCodes.ADMIN_ADD_COVER_TO_WORKSHOP_FAILED]: i18n.t("errors.ADMIN_ADD_COVER_TO_WORKSHOP_FAILED"),
  [ErrorCodes.INVALID_FILE_FORMAT]: i18n.t("errors.INVALID_FILE_FORMAT"),
  [ErrorCodes.WORKSHOP_FETCH_DATAPACK_FAILED]: i18n.t("errors.WORKSHOP_FETCH_DATAPACK_FAILED"),
  [ErrorCodes.METADATA_NOT_FOUND]: i18n.t("errors.METADATA_NOT_FOUND")
};
