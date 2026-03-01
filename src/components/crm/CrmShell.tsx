"use client";

import { useState, useRef } from "react";
import type { CrmScreenType, CrmState, CrmAction } from "@/types/crm";
import { SCREEN_LABELS } from "@/lib/crm-screen-mapper";
import CrmCustomerHeader from "./CrmCustomerHeader";
import AiCursor from "./AiCursor";
import RoamingScreen from "./screens/RoamingScreen";
import PlanChangeScreen from "./screens/PlanChangeScreen";
import DeviceChangeScreen from "./screens/DeviceChangeScreen";
import LostStolenScreen from "./screens/LostStolenScreen";
import CancellationScreen from "./screens/CancellationScreen";
import DataAddonScreen from "./screens/DataAddonScreen";
import CounselHistoryTab from "./tabs/CounselHistoryTab";
import BillingHistoryTab from "./tabs/BillingHistoryTab";
import CustomerNotesTab from "./tabs/CustomerNotesTab";

type TabType = "default" | "history" | "billing" | "notes";

const SIDEBAR_ITEMS: { type: CrmScreenType; icon: string; label: string }[] = [
  { type: "roaming", icon: "\u{1F4F1}", label: "로밍" },
  { type: "plan-change", icon: "\u{1F4CA}", label: "요금제" },
  { type: "device-change", icon: "\u{1F527}", label: "기기" },
  { type: "lost-stolen", icon: "\u{1F512}", label: "분실" },
  { type: "cancellation", icon: "\u{274C}", label: "해지" },
  { type: "data-addon", icon: "\u{1F4F6}", label: "데이터" },
];

const TABS: { type: TabType; label: string }[] = [
  { type: "default", label: "기본" },
  { type: "history", label: "이력" },
  { type: "billing", label: "청구" },
  { type: "notes", label: "메모" },
];

interface CrmShellProps {
  screenType: CrmScreenType;
  onScreenChange: (type: CrmScreenType) => void;
  state: CrmState;
  dispatch: (action: CrmAction) => void;
  highlightedElement: string | null;
  isAutoRunning: boolean;
  currentStepLabel: string;
  completedSteps: string[];
}

export default function CrmShell({
  screenType,
  onScreenChange,
  state,
  dispatch,
  highlightedElement,
  isAutoRunning,
  currentStepLabel,
  completedSteps,
}: CrmShellProps) {
  const [activeTab, setActiveTab] = useState<TabType>("default");
  const containerRef = useRef<HTMLDivElement>(null);

  const renderScreen = () => {
    const props = { dispatch, highlightedElement };

    switch (screenType) {
      case "roaming":
        return <RoamingScreen state={state.roaming} {...props} />;
      case "plan-change":
        return <PlanChangeScreen state={state.planChange} {...props} />;
      case "device-change":
        return <DeviceChangeScreen state={state.deviceChange} {...props} />;
      case "lost-stolen":
        return <LostStolenScreen state={state.lostStolen} {...props} />;
      case "cancellation":
        return <CancellationScreen state={state.cancellation} {...props} />;
      case "data-addon":
        return <DataAddonScreen state={state.dataAddon} {...props} />;
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case "history":
        return <CounselHistoryTab />;
      case "billing":
        return <BillingHistoryTab />;
      case "notes":
        return <CustomerNotesTab />;
      default:
        return renderScreen();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <CrmCustomerHeader />

      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <div className="w-16 bg-gray-900 flex flex-col shrink-0">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.type}
              onClick={() => {
                onScreenChange(item.type);
                setActiveTab("default");
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 text-[9px] transition-all ${
                screenType === item.type
                  ? "bg-[#E6007E] text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              <span className="mt-0.5">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Tabs + screen label */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-2">
            <div className="flex">
              {TABS.map((tab) => (
                <button
                  key={tab.type}
                  onClick={() => setActiveTab(tab.type)}
                  className={`px-3 py-1.5 text-[11px] font-medium border-b-2 transition-all ${
                    activeTab === tab.type
                      ? "border-[#E6007E] text-[#E6007E]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-gray-500">
              {SCREEN_LABELS[screenType]}
            </span>
          </div>

          {/* Content area with AI cursor overlay */}
          <div ref={containerRef} className="flex-1 overflow-y-auto relative">
            {renderTab()}
            <AiCursor
              targetElementId={highlightedElement}
              isRunning={isAutoRunning}
              containerRef={containerRef}
            />
          </div>
        </div>
      </div>

      {/* Status bar / Step log */}
      {(isAutoRunning || completedSteps.length > 0) && (
        <div className="border-t border-gray-200 bg-gray-900 text-white px-3 py-2 text-[11px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#E6007E] font-bold">AI</span>
            <span className="text-gray-300">자동 실행</span>
            {isAutoRunning && (
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            )}
          </div>
          <div className="space-y-0.5 max-h-16 overflow-y-auto">
            {completedSteps.map((step, i) => (
              <div key={i} className="text-green-400 text-[10px]">
                &#x2705; {step}
              </div>
            ))}
            {isAutoRunning && currentStepLabel && (
              <div className="text-yellow-400 text-[10px] flex items-center gap-1">
                <span className="animate-spin inline-block w-2.5 h-2.5 border border-yellow-400 border-t-transparent rounded-full" />
                {currentStepLabel}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
