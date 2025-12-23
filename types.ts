
export enum EligibilityStatus {
  IDLE = 'IDLE',
  CHECKING = 'CHECKING',
  ELIGIBLE = 'ELIGIBLE',
  NOT_ELIGIBLE = 'NOT_ELIGIBLE',
  MISSING_WALLET = 'MISSING_WALLET',
  ERROR = 'ERROR'
}

export interface WhitelistResult {
  status: EligibilityStatus;
  message?: string;
  oracleReading?: string;
}
