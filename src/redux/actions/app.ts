export const setOverlaySpinner = (overlaySpinner: boolean) => {
  return {
    type: 'SHOW_OVERLAY_SPINNER',
    overlaySpinner,
  };
};

export const setDrawerState = (drawer: boolean) => {
  return {
    type: 'SET_DRAWER_STATE',
    drawer,
  };
};

export const setPhoneNumber = (phId: string) => {
  return {
    type: 'SET_PHONE_NUMBER',
    phId,
  };
};

export const setActiveRouteName = (activeRouteName: string) => {
  return {
    type: 'SET_ACTIVE_ROUTE_NAME',
    activeRouteName,
  };
};

export const setActiveTab = (activeTab: string) => {
  return {
    type: 'SET_ACTIVE_ROUTE_TAB',
    activeTab,
  };
};
