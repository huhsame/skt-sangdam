"use client";

import { useReducer, useCallback, useState } from "react";
import type { CrmState, CrmAction, CrmScreenType } from "@/types/crm";
import { DATA_ADDON_DATA } from "@/lib/crm-dummy-data";

const initialState: CrmState = {
  roaming: {
    currentStatus: "미신청",
    selectedRegion: null,
    selectedProduct: null,
  },
  planChange: {
    selectedPlan: null,
    changeStatus: "미변경",
  },
  deviceChange: {
    selectedOption: null,
    selectedDevice: null,
    changeStatus: "미변경",
  },
  lostStolen: {
    deviceStatus: "정상",
    selectedOption: null,
  },
  cancellation: {
    selectedReason: null,
    cancelStatus: "미처리",
  },
  dataAddon: {
    addons: DATA_ADDON_DATA.addons.map((a) => ({
      name: a.name,
      active: a.active,
    })),
    selectedAddon: null,
  },
};

function crmReducer(state: CrmState, action: CrmAction): CrmState {
  switch (action.type) {
    case "ROAMING_SELECT_REGION":
      return { ...state, roaming: { ...state.roaming, selectedRegion: action.region } };
    case "ROAMING_SELECT_PRODUCT":
      return { ...state, roaming: { ...state.roaming, selectedProduct: action.index } };
    case "ROAMING_APPLY":
      return {
        ...state,
        roaming: { ...state.roaming, currentStatus: "신청완료" },
      };
    case "PLAN_SELECT":
      return { ...state, planChange: { ...state.planChange, selectedPlan: action.index } };
    case "PLAN_CHANGE":
      return {
        ...state,
        planChange: { ...state.planChange, changeStatus: "변경완료" },
      };
    case "DEVICE_SELECT_OPTION":
      return {
        ...state,
        deviceChange: { ...state.deviceChange, selectedOption: action.option },
      };
    case "DEVICE_SELECT":
      return {
        ...state,
        deviceChange: { ...state.deviceChange, selectedDevice: action.index },
      };
    case "DEVICE_OPEN":
      return {
        ...state,
        deviceChange: { ...state.deviceChange, changeStatus: "개통완료" },
      };
    case "LOST_SELECT_OPTION":
      return { ...state, lostStolen: { ...state.lostStolen, selectedOption: action.option } };
    case "LOST_SUSPEND":
      return {
        ...state,
        lostStolen: { ...state.lostStolen, deviceStatus: "분실정지" },
      };
    case "CANCEL_SELECT_REASON":
      return {
        ...state,
        cancellation: { ...state.cancellation, selectedReason: action.reason },
      };
    case "CANCEL_PROCESS":
      return {
        ...state,
        cancellation: { ...state.cancellation, cancelStatus: "해지완료" },
      };
    case "DATA_SELECT_ADDON":
      return { ...state, dataAddon: { ...state.dataAddon, selectedAddon: action.index } };
    case "DATA_ADD_ADDON": {
      const idx = state.dataAddon.selectedAddon;
      if (idx === null) return state;
      const newAddons = state.dataAddon.addons.map((a, i) =>
        i === idx ? { ...a, active: true } : a
      );
      return {
        ...state,
        dataAddon: { ...state.dataAddon, addons: newAddons, selectedAddon: null },
      };
    }
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

export function useCrmState() {
  const [state, dispatch] = useReducer(crmReducer, initialState);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);

  const resetState = useCallback(() => {
    dispatch({ type: "RESET", screenType: "roaming" });
    setHighlightedElement(null);
  }, []);

  return {
    state,
    dispatch,
    highlightedElement,
    setHighlightedElement,
    resetState,
  };
}
