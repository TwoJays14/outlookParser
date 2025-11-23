export let userData = {
  promotions: []
};

export function setUserData(userDataObject) {
  userData = {
    ...userData,
    ...userDataObject
  }
}