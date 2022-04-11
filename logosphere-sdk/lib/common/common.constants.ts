//TODO : Copy relevant values here

// export const ONE_DAY = 24 * 60 * 60;
// export const ONE_THOUSAND = 1000;
// export const ONE_DAY_MS = ONE_DAY * ONE_THOUSAND;
// export const UNDERSCORE = '_';
// export const STRING = 'string';


//TODO: Review and remove irrelevant

export const S3_URL_REGEX = '^s3://([^/]+)/(.*?([^/]+)/?)$';
export const DEFAULT_REGION = 'us-east-1';
export const VAULT_CMK = 'vulcan-vault-cmk';
export const VAULT_CARDANO_USER_PRIVATE_KEY_PREFIX = 'cpk';
export const VAULT_FLUREE_USER_PRIVATE_KEY_PREFIX = 'fpk';
export const MINTED_BY = 'VULCAN';
export const TIME_TO_LIVE = 10000;
export const FLUREE_FUEL = TIME_TO_LIVE * TIME_TO_LIVE;
export const NFT_STANDARD = '721';
export const ASSET_NAME = 'VULCAN';
export const NFT_VERSION = '1.0';
export const ONE_MILLION = 1000000;
export const ONE_ADA = ONE_MILLION;
export const HALF_ADA = ONE_MILLION / 2;
export const ONE_THOUSAND = 1000;
export const ONE_DAY = 24 * 60 * 60;
export const ONE_DAY_MS = ONE_DAY * ONE_THOUSAND;
export const KMS_STRATEGY = 'base64';
export const MULTIPLICATION_FACTOR = ONE_MILLION * ONE_MILLION;

// Pagination
export const ITEMS_PER_PAGE_DEFAULT = 10;
export const ITEMS_PER_PAGE = 'itemsPerPage';
export const PAGE_NUMBER = 'pageNumber';

//AppSync properties
export const ALPHA = 'alpha';
export const ALPHA_KEY = 'appSyncProperties';
export const DEV_KEY = 'dev-appSyncProperties';
export const DEV_FLUREE_KEYS = 'dev-flureeKeys';
export const ALPHA_FLUREE_KEYS = 'flureeKeys';

//SQS queue Types
export const MINTING_QUEUE = 'mint';
export const DEAD_LETTER_QUEUE = 'deadLetter';
export const L2_BUFFER_QUEUE = 'l2BufferQueue';

//Kinesis Stream types
export const DEFAULT_STREAM = 'fluree-ledger-stream';

export enum CONVERTOR {
  TO_SCALED_INTEGER_PRECISION_VALUE,
  TO_ORIGINAL_VALUE,
}

export enum TIME_CONVERTOR {
  TO_MILLI_SECONDS,
  TO_SECONDS,
}

// collections
export const ARTWORK = 'artwork';
export const LISTING = 'listing';
export const BID_EVENT = 'bidEvent';

// predicates
export const ID = 'Id';
export const IDENTIFIER = 'identifier';
export const VULCAN_END_USER_ROLE = 'vulcanEndUserRole';
export const CREATED_AT = 'createdAt';
export const END_DATE = 'endDate';
export const IS_PENDING = 'isPending';
export const LIKE_COUNT = 'likeCount';
export const CURRENT_PRICE = 'currentPrice';
export const BUY_NOW_PRICE = 'buyNowPrice';
export const TITLE = 'title';

// FlureeQL
export const SELECT = 'select';
export const FROM = 'from';
export const SUBJECT_ID = '_id';
export const DELETE = 'delete';

// JSON SCHEMA
export const JSON_SCHEMA_VERSION =
  'https://json-schema.org/draft/2019-09/schema';
export const JSON_SCHEMA_BASE_PATH =
  '../../../model/hackolade/schema_output/vulcan - JSON Schema';
export const JSON_SCHEMA_MODEL_PATH = `../model/schema.json`;
export const JSON_SCHEMA_QUERY_PATH = `${JSON_SCHEMA_BASE_PATH}/query`;
export const JSON_SCHEMA_MUTATION_PATH = `${JSON_SCHEMA_BASE_PATH}/mutation`;
export const CODEGEN_INTERFACE_OUTPUT = '../model/codegen/vulcan.ts';
export const REF = '$ref';
export const COLLECTION_REF = 'ref';
export const DEFS = '#/$defs/';
export const TYPE = 'type';
export const TYPE_JSON = 'json';
export const ARRAY = 'array';
export const ITEMS = 'items';
export const PROPERTIES = 'properties';
export const ENUM = 'enum';
export const COMMENT = '$comment';
export const PERSIST = 'persist';
export const NUMBER = 'number';
export const INTEGER = 'integer';
export const BIGINT = 'bigint';
export const STRING = 'string';
export const TIME = 'time';
export const UNIX_TIME = 'unix time';
export const INSTANT = 'instant';
export const DESCRIPTION = 'description';
export const EXAMPLES = 'examples';
export const SCHEMA_PATH_TYPE = '#/type';
export const UNDERSCORE = '_';
export const BASE_STRING = 'default';
export const MAX_LENGTH = 'maxLength';
export const ALPHABETIC = 'alphabetic';
export const MAX_ITEMS = 'maxItems';
export const MIN_ITEMS = 'minItems';
export const TYPENAME = '__typename';
export const SEPARATOR_SLASH = '/';

export const JSON_TO_INTERFACE_TYPE_MAP = {
  [INTEGER]: NUMBER,
};

// Fluree filter types
export const RANGE = 'range';
export const BOOLEAN = 'boolean';
export const EXISTS_NUMBER = 'existsNumber';
export const OBJECT = 'object';
export const VULCAN_TYPE = 'VulcanType';
export const VULCAN_BASE = 'VulcanBase';
export const VULCAN_EMPTY = 'VulcanEmpty';
export const EMPTY = 'empty';
export const REQUIRED = 'required';
export const ANY = 'any';
export const READ_ONLY = 'readOnly';
export const WRITE_ONLY = 'writeOnly';

//EXCHANGE RATE
export const IDS = 'cardano';
export const VS_CURRENCIES = 'usd,cad,eur,btc,eth';

//Response builder
export const CONVERT_PRICE = 'convertPrice';

//Axios content
export const CONTENT_TYPE_KEY = 'Content-Type';

//JIRA specific content
export const JIRA_SERVICE_DESK_ID_VULCAN = `1`;
export const JIRA_REQUEST_TYPE_EMAIL = '5';

// debug
export const DEBUG: boolean = process.env.VULCAN_DEBUG === 'true';

// Telemetry

//metrics
export const RECORD_METRICS: boolean =
  process.env.VULCAN_RECORD_METRICS === 'true';
export const METRIC_NAMESPACE = 'vulcan';
export const FLUREE_BUFFER_RECORDS = 'fluree-buffer-records';
export const FLUREE_DB_LATENCY = 'fluree-latency';
export const FLUREE_DB_DURATION = 'fluree-duration';
export const FLUREE_DB_ERRORS = 'fluree-errors';
//export const

// Units
export const UNIT_MILLISECONDS = 'Milliseconds';
export const UNIT_COUNTS = 'Counts';

export const AFTER_THIRTY_SECONDS: number = Date.now() + 30000;

// Lambda warmer
export const lambdaWarmerConfig: any = {
  flag: 'warmer',
  concurrency: 'concurrency',
  test: 'test',
  log: true,
  correlationId: 'XXXXXXXXXXXXX', //not used for now
  delay: 75,
};

// Buffer
export const BUFFER_LATEST_STATE = 'latest_state';
export const BUFFER_RDS_SCHEMA = 'vulcan';

//USER_COGNITO_POOL
export const TOKEN_USE = 'access';
export const COGNITO_USER = 'username';
export const USER_COGNITO_POOL_ID = 'us-east-1_EjP9Md9n1';
export const USER_COGNITO_CLIENT_ID = 'lp3jm6pe80n2g3gi6a9g57050';

// OPEN TELEMETRY
export const OTEL_SERVICE_NAME = 'vulcan-open-telemetry';
export const OTEL_METER_INTERVAL = 1000;

// METRICS
export const HL_TX_LATENCY = 'hl.tx.latency';
export const HL_TX_COUNT = 'hl.tx.count';
export const L2_TX_LATENCY = 'l2.tx.latency';
export const L2_BUFFER_BATCH_SIZE = 'l2.buffer.batch.size';
export const L2_TX_REC_COUNT = 'l2.tx.record.count';
export const L2_TX_COUNT = 'l2.tx.count';
export const L2_FAILED_TX_COUNT = 'l2.failed.tx.count';
export const L2_PAGED_ERROR_COUNT = 'l2.paged.error.count';
export const L2_VIP_TX_COUNT = 'l2.vip.tx.count';
