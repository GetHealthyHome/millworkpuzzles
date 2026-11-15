'use client';
import { useState } from 'react';

// Stub: format check only. Real validation must happen server-side against the COA ledger.
const SERIAL = /^MW-\d{3}-\d{3}-[A-Z0-9]{4}$/;

export default function RegistryForm() {
  const [v, setV] = useState('');
  const [state, setState] = useState('idle');
  const submit = (e) => {
    e.preventDefault();
    setState(SERIAL.test(v.trim().toUpperCase()) ? 'ok' : 'bad');
  };
  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 12 }} noValidate>
      <label htmlFor="coa" className="mono">COA serial</label>
      <input id="coa" className="input mono" placeholder="MW-003-014-A7K2" value={v} onChange={(e) => setV(e.target.value)} aria-describedby="coa-msg" autoComplete="off" />
      <button className="btn btn-primary" type="submit">Register certificate</button>
      <p id="coa-msg" role="status" className="mono" style={{ minHeight: 20, margin: 0 }}>
        {state === 'ok' && 'Certificate recognised. Registry unlocked (stub).'}
        {state === 'bad' && 'Format is MW-DROP-EDITION-CODE, e.g. MW-003-014-A7K2.'}
      </p>
    </form>
  );
}
