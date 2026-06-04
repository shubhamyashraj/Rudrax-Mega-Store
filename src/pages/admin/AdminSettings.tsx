import React, { useState } from 'react';
import { useRudrax } from '../../app/StateContext';
import { Button, Input } from '../../components/ui/atoms';
import { Settings, Save, CheckCircle } from 'lucide-react';

export function AdminSettings() {
  const { settings, updateSettings } = useRudrax();

  const [storeName, setStoreName] = useState<string>(settings.storeName);
  const [contactEmail, setContactEmail] = useState<string>(settings.contactEmail);
  const [supportPhone, setSupportPhone] = useState<string>(settings.supportPhone);
  const [taxRate, setTaxRate] = useState<number>(settings.defaultTaxRate);
  const [shippingThreshold, setShippingThreshold] = useState<number>(settings.freeShippingThreshold);
  const [shippingFee, setShippingFee] = useState<number>(settings.standardShippingFee);

  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);

  const handleSaveConfigs = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      contactEmail,
      supportPhone,
      defaultTaxRate: taxRate,
      freeShippingThreshold: shippingThreshold,
      standardShippingFee: shippingFee,
      loyaltyPointsPerDollar: settings.loyaltyPointsPerDollar
    });

    setShowSavedToast(true);
    setTimeout(() => { setShowSavedToast(false); }, 3000);
  };

  return (
    <div className="admin-settings flex flex-col gap-6 max-w-2xl p-4">
      {/* Title */}
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
          <Settings size={24} className="text-teal-605" /> System Settings
        </h1>
        <p className="text-xs text-slate-500 font-bold tracking-wide mt-1.5 uppercase font-mono">Configure Tax, Delivery margins & Store metrics</p>
      </div>

      <form onSubmit={handleSaveConfigs} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-5">
        <h2 className="text-xs font-black uppercase tracking-wider text-teal-700 pb-2 border-b border-slate-100">Supermarket Properties</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
          <Input label="Store Name" value={storeName} onChange={setStoreName} />
          <Input label="Support Email" type="email" value={contactEmail} onChange={setContactEmail} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Support Phone Hotline" value={supportPhone} onChange={setSupportPhone} />
          <Input label="Default Packaging & GST Tariff (%)" type="number" min="0" value={taxRate} onChange={v => setTaxRate(Number(v))} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Standard Shipping Rate (₹)" type="number" min="0" value={shippingFee} onChange={v => setShippingFee(Number(v))} />
          <Input label="Free Shipping Basket Threshold (₹)" type="number" min="1" value={shippingThreshold} onChange={v => setShippingThreshold(Number(v))} />
        </div>

        {showSavedToast && (
          <div className="bg-emerald-50 text-emerald-850 text-xs font-bold leading-none p-3.5 rounded-xl border border-emerald-250 flex items-center gap-1.5 animate-fadeIn font-mono">
            <CheckCircle size={15} className="text-emerald-600" /> Configurations stored safely back to live localStorage.
          </div>
        )}

        <div className="pt-3 border-t border-slate-101 flex justify-end">
          <Button variant="primary" size="sm" type="submit" className="flex items-center gap-1.5 shadow-md shadow-teal-600/15">
            <Save size={15} /> Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
export { AdminSettings as default };
