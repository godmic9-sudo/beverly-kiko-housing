import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';

const initialProperties = [
  { id: 'PROP-101', title: 'Beverly Heights - Unit A1', location: 'Kololo, Kampala', rentUgx: 1800000, tenant: 'Abram Carter', phone: '0770000001' },
  { id: 'PROP-102', title: 'Beverly Suites - Unit B4', location: 'Naalya, Kampala', rentUgx: 850000, tenant: 'Kiko Housing', phone: '0750000002' },
  { id: 'PROP-103', title: 'Beverly Manor - Unit C2', location: 'Ntinda, Kampala', rentUgx: 1200000, tenant: 'N/A', phone: 'N/A' },
  { id: 'PROP-104', title: 'Beverly Villa - Unit 05', location: 'Muyenga, Kampala', rentUgx: 2500000, tenant: 'Sarah N', phone: '0780000003' },
];

const availableMonths = [
  { id: 'Jan-2026', label: 'January 2026' },
  { id: 'Feb-2026', label: 'February 2026' },
  { id: 'Mar-2026', label: 'March 2026' },
  { id: 'Apr-2026', label: 'April 2026' },
  { id: 'May-2026', label: 'May 2026' },
  { id: 'Jun-2026', label: 'June 2026' },
  { id: 'Jul-2026', label: 'July 2026' },
  { id: 'Aug-2026', label: 'August 2026' },
  { id: 'Sep-2026', label: 'September 2026' },
  { id: 'Oct-2026', label: 'October 2026' },
  { id: 'Nov-2026', label: 'November 2026' },
  { id: 'Dec-2026', label: 'December 2026' },
];

// --- TENANT PORTAL PAGE WITH RECEIPT ---
function TenantPortal({ onNewPayment }) {
  const [selectedUnit, setSelectedUnit] = useState(initialProperties[0]);
  const [selectedMonths, setSelectedMonths] = useState(['Oct-2026']);
  const [phone, setPhone] = useState('');
  const [provider, setProvider] = useState('MTN Mobile Money');
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle', 'processing', 'success'
  const [latestReceipt, setLatestReceipt] = useState(null);

  const toggleMonth = (monthId) => {
    if (selectedMonths.includes(monthId)) {
      if (selectedMonths.length > 1) {
        setSelectedMonths(selectedMonths.filter(m => m !== monthId));
      }
    } else {
      setSelectedMonths([...selectedMonths, monthId]);
    }
  };

  const totalAmountDue = selectedUnit.rentUgx * selectedMonths.length;

  const handleTenantPayment = (e) => {
    e.preventDefault();
    if (selectedMonths.length === 0) return;

    setPaymentStatus('processing');

    setTimeout(() => {
      const monthNames = selectedMonths.map(m => availableMonths.find(am => am.id === m)?.label).join(', ');

      const newTxn = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        unit: selectedUnit.title,
        tenant: selectedUnit.tenant,
        monthsPaid: monthNames,
        amount: totalAmountDue,
        provider: provider,
        phone: phone,
        time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setLatestReceipt(newTxn);
      onNewPayment(newTxn);
      setPaymentStatus('success');
    }, 2500);
  };

  return (
    <main style={{ maxWidth: '520px', margin: '30px auto', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ margin: '0 0 6px 0', color: '#0f766e', fontSize: '20px' }}>Pay Rent Online</h2>
        <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '14px' }}>Select your unit, tick the month(s) you are paying for, and approve via Mobile Money.</p>

        {paymentStatus === 'success' && latestReceipt ? (
          /* --- OFFICIAL DIGITAL RECEIPT VIEW --- */
          <div style={{ backgroundColor: '#fcfcfc', border: '2px dashed #0f766e', borderRadius: '10px', padding: '20px', marginTop: '10px' }}>
            <div style={{ textAlign: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 4px 0', color: '#0f766e', fontSize: '18px' }}>Beverly Kiko Housing Uganda</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Official Rent Payment Receipt</p>
              <span style={{ display: 'inline-block', marginTop: '8px', background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                PAID & VERIFIED ✓
              </span>
            </div>

            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#374151', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Transaction ID:</span>
                <strong>{latestReceipt.id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tenant Name:</span>
                <strong>{latestReceipt.tenant}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Housing Unit:</span>
                <strong>{latestReceipt.unit}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Month(s) Covered:</span>
                <strong style={{ color: '#0f766e', textAlign: 'right', maxWidth: '220px' }}>{latestReceipt.monthsPaid}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Payment Network:</span>
                <span>{latestReceipt.provider} ({latestReceipt.phone})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Date & Time:</span>
                <span>{latestReceipt.time}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', paddingTop: '8px', marginTop: '4px', fontSize: '15px' }}>
                <span style={{ fontWeight: 'bold' }}>Total Paid:</span>
                <strong style={{ color: '#16a34a' }}>UGX {latestReceipt.amount.toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => window.print()} 
                style={{ flex: 1, padding: '10px', background: '#374151', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                🖨️ Print / Save Receipt
              </button>
              <button 
                onClick={() => { setPaymentStatus('idle'); setSelectedMonths(['Oct-2026']); setPhone(''); }} 
                style={{ flex: 1, padding: '10px', background: '#0f766e', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                Make Another Payment
              </button>
            </div>
          </div>
        ) : (
          /* --- PAYMENT FORM & CALENDAR --- */
          <>
            <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Select Your Housing Unit</label>
            <select