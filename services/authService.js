import settings from "../appConfig/config.js";
import {BrowserAuthError, InteractionRequiredAuthError, PublicClientApplication} from "@azure/msal-browser";

const msalPublicClientApplicationInstance = new PublicClientApplication({
  auth: {
    clientId: settings.clientId,
    authority: `${settings.authorityUrl}/${settings.tenantId}`,
    redirectUri: settings.localhostUrl,
  }
});

await msalPublicClientApplicationInstance.initialize();

export async function loginUser() {
  console.log("loginUser called")
  return await msalPublicClientApplicationInstance.loginPopup({
    scopes: settings.graphUserScopes
  });
}

export function getActiveAccount() {
  console.log("getActiveAccount called")
  return msalPublicClientApplicationInstance.getAllAccounts()[0];
}

export function setActiveAccount(activeAccount) {
  console.log("setActiveAccount")
  msalPublicClientApplicationInstance.setActiveAccount(activeAccount);
}

export async function getAccessToken(activeAccount) {
  console.log("getAccessToken called")
  const token = await msalPublicClientApplicationInstance.acquireTokenSilent({
    scopes: settings.graphUserScopes,
    account: activeAccount,
  });

  if (token instanceof InteractionRequiredAuthError || token instanceof BrowserAuthError) {
    return msalPublicClientApplicationInstance.acquireTokenPopup({
      scopes: settings.graphUserScopes
    })
  }

  return token;
}
