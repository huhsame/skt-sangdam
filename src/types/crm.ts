export type CrmScreenType =
  | "roaming"
  | "lost-stolen"
  | "cancellation"
  | "device-change"
  | "plan-change"
  | "data-addon";

export interface CrmState {
  roaming: {
    currentStatus: string;
    selectedRegion: string | null;
    selectedProduct: number | null;
  };
  planChange: {
    selectedPlan: number | null;
    changeStatus: string;
  };
  deviceChange: {
    selectedOption: string | null;
    selectedDevice: number | null;
    changeStatus: string;
  };
  lostStolen: {
    deviceStatus: string;
    selectedOption: string | null;
  };
  cancellation: {
    selectedReason: string | null;
    cancelStatus: string;
  };
  dataAddon: {
    addons: { name: string; active: boolean }[];
    selectedAddon: number | null;
  };
}

export interface CrmActionStep {
  elementId: string;
  action: "highlight" | "click" | "select";
  value?: string | number;
  label: string;
  delayBefore: number;
  delayAfter: number;
}

export type CrmAction =
  | { type: "ROAMING_SELECT_REGION"; region: string }
  | { type: "ROAMING_SELECT_PRODUCT"; index: number }
  | { type: "ROAMING_APPLY" }
  | { type: "PLAN_SELECT"; index: number }
  | { type: "PLAN_CHANGE" }
  | { type: "DEVICE_SELECT_OPTION"; option: string }
  | { type: "DEVICE_SELECT"; index: number }
  | { type: "DEVICE_OPEN" }
  | { type: "LOST_SELECT_OPTION"; option: string }
  | { type: "LOST_SUSPEND" }
  | { type: "CANCEL_SELECT_REASON"; reason: string }
  | { type: "CANCEL_PROCESS" }
  | { type: "DATA_SELECT_ADDON"; index: number }
  | { type: "DATA_ADD_ADDON" }
  | { type: "RESET"; screenType: CrmScreenType };
