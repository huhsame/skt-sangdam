"use client";

import { determineCrmScreen, SCREEN_LABELS, type CrmScreenType } from "@/lib/crm-screen-mapper";
import CrmCustomerHeader from "./CrmCustomerHeader";
import RoamingScreen from "./screens/RoamingScreen";
import PlanChangeScreen from "./screens/PlanChangeScreen";
import DeviceChangeScreen from "./screens/DeviceChangeScreen";
import LostStolenScreen from "./screens/LostStolenScreen";
import CancellationScreen from "./screens/CancellationScreen";
import DataAddonScreen from "./screens/DataAddonScreen";

const SCREEN_COMPONENTS: Record<CrmScreenType, React.ComponentType> = {
  roaming: RoamingScreen,
  "plan-change": PlanChangeScreen,
  "device-change": DeviceChangeScreen,
  "lost-stolen": LostStolenScreen,
  cancellation: CancellationScreen,
  "data-addon": DataAddonScreen,
};

interface CrmDemoPanelProps {
  keywords: string[];
}

export default function CrmDemoPanel({ keywords }: CrmDemoPanelProps) {
  if (keywords.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 text-gray-400">
        <div className="text-center">
          <div className="text-2xl mb-2">📋</div>
          <p className="text-sm">검색 시 CRM 화면이 표시됩니다</p>
        </div>
      </div>
    );
  }

  const screenType = determineCrmScreen(keywords);
  const ScreenComponent = SCREEN_COMPONENTS[screenType];

  return (
    <div className="h-full flex flex-col bg-white">
      <CrmCustomerHeader />
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50 border-b border-gray-200">
        <span className="text-xs font-bold text-gray-700">{SCREEN_LABELS[screenType]}</span>
        <span className="text-[10px] text-gray-400">
          키워드: {keywords.slice(0, 3).join(", ")}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ScreenComponent />
      </div>
    </div>
  );
}
