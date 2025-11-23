"use strict";

import {
  getAccessToken,
  getActiveAccount,
  loginUser,
  setActiveAccount
} from "../services/authService.js";

import {
  getCurrentUserData,
  getInboxMessages,
  getPromotions} from "../services/emailService.js";

import {
  createModalDialogElement,
  renderTable,
  setupSearchEventListener
} from "../services/uiService.js";

import {
  setUserData,
  userData
} from "../services/userService.js";

// TODO: pagination
// TODO: logout
// TODO: clear session cookies when browserAuthError
// TODO: error handling
// TODO: handle case if user has no promotional emails when logging in

document.querySelector('.signup-btn').addEventListener('click', async () => {
  const user = await loginUser();

  if (!user) {
    throw new Error(`Authentication Error: ${user}`)
  }

  setUserData({
    accessToken: user.accessToken,
    idToken: user.idToken,
    name: user.account.name,
  })

  const activeAccount = getActiveAccount();

  if (!activeAccount) {
    throw new Error(`Error getting active account: ${activeAccount}`);
  }

  setActiveAccount(activeAccount);

  const activeAccountToken = await getAccessToken(activeAccount);
  const currentUserData = await getCurrentUserData(activeAccountToken);

  setUserData({
    userPrincipalName: currentUserData.userPrincipalName,
    id: currentUserData.id,
    displayName: currentUserData.displayName,
    inboxMessages: (await getInboxMessages())
  });

  const promotions = getPromotions(userData.inboxMessages);

  renderTable(promotions);

  createModalDialogElement();

  setupSearchEventListener();
});