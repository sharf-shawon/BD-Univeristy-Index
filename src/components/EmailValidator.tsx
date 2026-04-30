/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";

interface EmailValidatorProps {
  universityDomain: string | null;
  universityName: string;
}

export default function EmailValidator({ universityDomain, universityName }: EmailValidatorProps) {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{ isValid: boolean; message: string } | null>(null);

  const validateEmail = () => {
    if (!email) return;
    if (!universityDomain) {
      setResult({ isValid: false, message: "No official domain record found for this institution." });
      return;
    }

    try {
      const hostname = new URL(universityDomain).hostname.replace('www.', '').toLowerCase();
      const emailDomain = email.split('@')[1]?.toLowerCase();

      if (!emailDomain) {
        setResult({ isValid: false, message: "Please enter a complete email address." });
        return;
      }

      if (emailDomain === hostname || emailDomain.endsWith('.' + hostname)) {
        setResult({ 
          isValid: true, 
          message: `Verified! This email belongs to the official ${universityName} domain.` 
        });
      } else {
        setResult({ 
          isValid: false, 
          message: `Validation failed. This email does not match the official record for ${hostname}.` 
        });
      }
    } catch (e) {
      setResult({ isValid: false, message: "Critical error reading institutional domain record." });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Institutional Email Validator</h4>
      </div>
      
      <p className="text-xs text-slate-500 mb-6 leading-relaxed">
        Verify if a student, faculty, or staff email address belongs to the officially registered domain of <strong>{universityName}</strong>.
      </p>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="e.g. name@university.ac.bd"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setResult(null);
            }}
          />
          <button
            onClick={validateEmail}
            disabled={!email}
            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Verify
          </button>
        </div>

        {result && (
          <div className={`flex items-start gap-3 p-4 rounded-xl border ${
            result.isValid ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
          }`}>
            {result.isValid ? <CheckCircle2 className="h-4 w-4 mt-0.5" /> : <XCircle className="h-4 w-4 mt-0.5" />}
            <p className="text-xs font-bold leading-tight">{result.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
