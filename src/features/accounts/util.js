import axios from 'axios';
import config from '../../config/app';

export const doLinkTokenRequest = async () => axios({
  method: 'GET',
  baseURL: config.BASE_PATH,
  url: 'api/v1/account/linktoken'
});

export const doCreateAccountRequest = async (
  publicToken, description, accountName, remoteId, lastFour
) => axios({
  method: 'POST',
  baseURL: config.BASE_PATH,
  url: 'api/v1/account',
  data: {
    public_token: publicToken,
    description,
    account_name: accountName,
    remote_id: remoteId,
    last_four: lastFour
  }
})

export const doUpdateAccountRequest = async (
  accountId,
  description,
  accountType,
  balanceToMaintain,
  includeInOverall,
) => axios({
  method: 'PUT',
  baseURL: config.BASE_PATH,
  url: `api/v1/account/${accountId}`,
  data: {
    account_id: accountId,
    description,
    type: accountType,
    balance_to_maintain: balanceToMaintain,
    include_in_overall: includeInOverall,
  }
})

export const doGetAccountsRequest = async () => axios({
  method: 'GET',
  baseURL: config.BASE_PATH,
  url: 'api/v1/account'
})

export const doGetAccountRequest = async (accountId) => axios({
  method: 'GET',
  baseURL: config.BASE_PATH,
  url: `api/v1/account/${accountId}`
})

export const doRefreshDataRequest = async () => axios({
  method: 'GET',
  baseURL: config.BASE_PATH,
  url: `api/v1/refresh_data`
})