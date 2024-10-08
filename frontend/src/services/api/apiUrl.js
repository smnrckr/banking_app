const BASE_API_URL = 'http://localhost:8080/api';
export { BASE_API_URL };
export const register = `${BASE_API_URL}/register`;
export const login = `${BASE_API_URL}/login`;
export const loans = (userCode) => `${BASE_API_URL}/loans/${userCode}`;
export const newApplication = (userCode) => `${BASE_API_URL}/newApplication/${userCode}`; 
export const distinctNames = `${BASE_API_URL}/user/:userCode/distinct`;
export const campaign_rates = (campaignName, termLoan) => `${BASE_API_URL}/campaign/details?campaignName=${campaignName}&termLoan=${termLoan}`;
export const userList = `${BASE_API_URL}/users`;
export const userCampaignTable = `${BASE_API_URL}/user-campaign-table`;
export const campaignList = `${BASE_API_URL}/campaigns`;
export const userCampaignTerms = (userCode, campaignName) =>
    `${BASE_API_URL}/campaign/user/terms?userCode=${(userCode)}&campaignName=${encodeURIComponent(campaignName)}`;
  