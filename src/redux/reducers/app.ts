export interface IAppReducer {
  overlaySpinner: boolean;
  drawer: boolean;
  activeRouteName: string;
  activeTab: string;
}

const initialState: IAppReducer = {
  overlaySpinner: false,
  drawer: false,
  activeRouteName: '',
  activeTab: '',
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case 'SHOW_OVERLAY_SPINNER':
      return (state = {
        ...state,
        overlaySpinner: action.overlaySpinner,
      });
    case 'SET_DRAWER_STATE':
      return (state = {
        ...state,
        drawer: action.drawer,
      });
    case 'SET_ACTIVE_ROUTE_NAME':
      return (state = {
        ...state,
        activeRouteName: action.activeRouteName,
      });
    case 'SET_ACTIVE_ROUTE_TAB':
      return (state = {
        ...state,
        activeTab: action.activeTab,
      });
    default:
      return state;
  }
};
