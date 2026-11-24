import { FundingCall } from './funding-calls-api';

// A hint for the UI only: the backend refuses a submission outside the period anyway.
export function acceptsApplications(call: FundingCall, now = Date.now()): boolean {
  return Date.parse(call.opensAt) <= now && now < Date.parse(call.closesAt);
}
