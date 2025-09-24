import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  preloader: boolean;
  authToken: string | null;
  loginId: string | null;
  companyName: string | null;
  onboardingName: string | null;
  lastLogin: string | null;
  customerID: string | null;
  profileID: string | null;
  legalEntityType: string | null;
  workFlowID: string | null;
  agreementBoolean: string | null;
  applicationId: string | null;
  tabSelected: string | null;
  currentMillis: string | null;
  supplierList: string | null;
  leadID: string | null;
  digioSelected: string | null;
}

const getLocal = (key: string) => localStorage.getItem(key);

const initialState: AppState = {
  preloader: false,
  authToken: getLocal('authtoken'),
  loginId: getLocal('loginId'),
  companyName: getLocal('companyName'),
  onboardingName: getLocal('onboardingName'),
  lastLogin: getLocal('lastLogin'),
  customerID: getLocal('customerID'),
  profileID: getLocal('profileID'),
  legalEntityType: getLocal('legalEntityType'),
  workFlowID: getLocal('workFlowID'),
  agreementBoolean: getLocal('agreementBoolean'),
  applicationId: getLocal('applicationId'),
  tabSelected: getLocal('tabSelected'), //
  currentMillis: getLocal('currentMillis'), //
  supplierList: getLocal('supplierList'), //
  leadID: getLocal('leadID'), //
  digioSelected: getLocal('digioSelected'), //
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    routeChange(state, action: PayloadAction<'start' | 'end'>) {
      state.preloader = action.payload === 'start';
    },
    setLoginId(state, action: PayloadAction<string>) {
      state.loginId = action.payload;
      localStorage.setItem('loginId', action.payload);
    },
    setLastLogin(state, action: PayloadAction<string>) {
      state.lastLogin = action.payload;
      localStorage.setItem('lastLogin', action.payload);
    },
    setCompanyName(state, action: PayloadAction<string>) {
      state.companyName = action.payload;
      localStorage.setItem('companyName', action.payload);
    },
    setOnboardingName(state, action: PayloadAction<string>) {
      state.onboardingName = action.payload;
      localStorage.setItem('onboardingName', action.payload);
    },
    setAuthToken(state, action: PayloadAction<string>) {
      state.authToken = action.payload;
      localStorage.setItem('authtoken', action.payload);
    },
    setPreloader(state, action: PayloadAction<boolean>) {
      state.preloader = action.payload;
      localStorage.setItem('preloader', String(action.payload));
    },
    setCustomerID(state, action: PayloadAction<string>) {
      state.customerID = action.payload;
      localStorage.setItem('customerID', action.payload);
    },
    setTabSelected(state, action: PayloadAction<string>) {  //
      state.tabSelected = action.payload;
      localStorage.setItem("tabSelected", action.payload);
    },
    setProfileID(state, action: PayloadAction<string>) {   
      state.profileID = action.payload;
      localStorage.setItem('profileID', action.payload);
    },
    setLegalEntityType(state, action: PayloadAction<string>) {  
      state.legalEntityType = action.payload;
      localStorage.setItem('legalEntityType', action.payload);
    },
    setWorkFlowID(state, action: PayloadAction<string>) {
      state.workFlowID = action.payload;
      localStorage.setItem('workFlowID', action.payload);
    },
    setAgreementBoolean(state, action: PayloadAction<string>) {
      state.agreementBoolean = action.payload;
      localStorage.setItem('agreementBoolean', action.payload);
    },
    setCurrentMillis(state, action: PayloadAction<string>) {  //
      state.currentMillis = action.payload;
      localStorage.setItem("currentMillis", action.payload);
    },
    setSupplierList(state, action: PayloadAction<string>) {   //
      state.supplierList = action.payload;
      localStorage.setItem("supplierList", action.payload);
    },
    setLeadID(state, action: PayloadAction<string>) {   //
      state.leadID = action.payload;
      localStorage.setItem("leadID", action.payload);
    },
    setApplicationId(state, action: PayloadAction<string>) {
      state.applicationId = action.payload;
      localStorage.setItem('applicationId', action.payload);
    },
    setDigioSelected(state, action: PayloadAction<string>) {  //
      state.digioSelected = action.payload;
      localStorage.setItem("digioSelected", action.payload);
    },
  },
});

export const {
  routeChange,
  setLoginId,
  setLastLogin,
  setCompanyName,
  setOnboardingName,
  setAuthToken,
  setPreloader,
  setCustomerID,
  setProfileID,
  setLegalEntityType,
  setWorkFlowID,
  setAgreementBoolean,
  setApplicationId,
  setTabSelected,
  setCurrentMillis,
  setSupplierList,
  setLeadID,
  setDigioSelected,
} = appSlice.actions;

export default appSlice.reducer;