"use client";

import { useState } from "react";
import { Label, Select, Input } from "@/components/ui";

const COUNTRY_CODES = [
  { code: "+52", label: "🇲🇽 México (+52)" },
  { code: "+1", label: "🇺🇸 EE. UU. / Canadá (+1)" },
  { code: "+34", label: "🇪🇸 España (+34)" },
  { code: "+57", label: "🇨🇴 Colombia (+57)" },
  { code: "+54", label: "🇦🇷 Argentina (+54)" },
  { code: "+56", label: "🇨🇱 Chile (+56)" },
  { code: "+51", label: "🇵🇪 Perú (+51)" },
  { code: "+593", label: "🇪🇨 Ecuador (+593)" },
  { code: "+58", label: "🇻🇪 Venezuela (+58)" },
  { code: "+502", label: "🇬🇹 Guatemala (+502)" },
  { code: "+503", label: "🇸🇻 El Salvador (+503)" },
  { code: "+504", label: "🇭🇳 Honduras (+504)" },
  { code: "+505", label: "🇳🇮 Nicaragua (+505)" },
  { code: "+506", label: "🇨🇷 Costa Rica (+506)" },
  { code: "+507", label: "🇵🇦 Panamá (+507)" },
  { code: "+598", label: "🇺🇾 Uruguay (+598)" },
  { code: "+595", label: "🇵🇾 Paraguay (+595)" },
  { code: "+591", label: "🇧🇴 Bolivia (+591)" },
  { code: "+53", label: "🇨🇺 Cuba (+53)" },
];

export function PhoneFields({
  defaultCountryCode = "+52",
  defaultPhone = "",
}: {
  defaultCountryCode?: string;
  defaultPhone?: string;
}) {
  const [phone, setPhone] = useState(defaultPhone);

  return (
    <div>
      <Label htmlFor="phone">Teléfono *</Label>
      <div className="grid grid-cols-[128px_1fr] gap-2">
        <Select id="phoneCountryCode" name="phoneCountryCode" defaultValue={defaultCountryCode}>
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </Select>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          required
          maxLength={10}
          placeholder="10 dígitos"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
        />
      </div>
      <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">Exactamente 10 dígitos, sin espacios ni guiones.</p>
    </div>
  );
}
