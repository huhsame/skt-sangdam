import { CUSTOMER } from "@/lib/crm-dummy-data";

export default function CrmCustomerHeader() {
  return (
    <div className="bg-gray-900 text-white px-3 py-2 flex items-center gap-3 text-xs">
      <span className="font-bold">{CUSTOMER.name}</span>
      <span className="text-gray-400">|</span>
      <span>{CUSTOMER.phone}</span>
      <span className="text-gray-400">|</span>
      <span className="bg-yellow-500 text-black px-1.5 py-0.5 rounded text-[10px] font-bold">
        {CUSTOMER.grade}
      </span>
      <span className="text-gray-400">|</span>
      <span className="text-gray-300">{CUSTOMER.plan}</span>
      <span className="text-gray-400">|</span>
      <span className="text-gray-400">가입: {CUSTOMER.joinDate}</span>
      <div className="ml-auto">
        <span className="bg-[#E6007E]/20 text-[#E6007E] px-1.5 py-0.5 rounded text-[10px] font-bold border border-[#E6007E]/30">
          DEMO
        </span>
      </div>
    </div>
  );
}
