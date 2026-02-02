"use client";

import { useState } from "react";
import { BILLING_HISTORY } from "@/lib/crm-dummy-data";

export default function BillingHistoryTab() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="p-3 space-y-2 text-xs">
      <div className="text-[11px] text-gray-500 font-medium mb-2">최근 청구 내역</div>
      <div className="space-y-2">
        {BILLING_HISTORY.map((bill, i) => (
          <div key={i} className="bg-white border rounded overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full flex items-center justify-between p-2.5 hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{bill.month}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  bill.status === "납부완료"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {bill.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">{bill.total}</span>
                <span className="text-gray-400">{expanded === i ? "▲" : "▼"}</span>
              </div>
            </button>

            {expanded === i && (
              <div className="border-t bg-gray-50 p-2.5 space-y-1">
                {bill.breakdown.map((item, j) => (
                  <div key={j} className="flex justify-between">
                    <span className="text-gray-600">{item.item}</span>
                    <span className={`font-medium ${
                      item.amount.startsWith("-") ? "text-blue-600" : "text-gray-900"
                    }`}>
                      {item.amount}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-1 mt-1 flex justify-between text-[10px] text-gray-400">
                  <span>납부일</span>
                  <span>{bill.payDate}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
