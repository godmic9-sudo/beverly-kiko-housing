import React, { useState } from 'react';

const initialProperties = [
  { id: 'PROP-101', title: 'Beverly Heights - Unit A1', location: 'Kololo, Kampala', rentUgx: 1800000, tenant: 'Abram Carter', phone: '0770000001', status: 'Due' },
  { id: 'PROP-102', title: 'Beverly Suites - Unit B4', location: 'Naalya, Kampala', rentUgx: 850000, tenant: 'Kiko Housing', phone: '0750000002', status: 'Due' },
];

export default function App() {
  const [role, setRole] = useState('tenant'); // 'tenant' or 'admin'
  const [selectedUnit, setSelectedUnit] = useState(initialProperties[0]);
  const [phone, setPhone] = useState('');
  const [provider, setProvider] = useState('MTN Mobile Money');
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle', 'processing', 'success'
  
  // Real-time notification list for Landlord/Admin
  const [notifications, setNotifications] = useState([]);
  const [transactions, setTransactions] = useState([
    { id: 'TXN-9021', unit: 'Beverly Heights - Unit A1', amount: 1800000, provider: 'MTN Mobile Money', time: 'Yesterday' }
  ]);

  const handleTenantPayment = (e) => {
    e.preventDefault();
    setPaymentStatus('processing');

    // Simulate STK Push prompt & payment success
    setTimeout(() => {
      const newTxn = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        unit: selectedUnit.title,
        amount: selectedUnit.rentUgx,
        provider: provider,
        time: 'Just Now'
      };

      setTransactions([newTxn, ...transactions]);
      setNotifications([`🔔 Payment Received: UGX ${selectedUnit.rentUgx.toLocaleString()} from ${selectedUnit.tenant} (${selectedUnit.title})`, ...notifications]);
      setPaymentStatus('success');
    }, 2500);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh', paddingBottom: '40px' }}>
      
      {/* Top Bar with Role Switcher */}
      <div style={{ backgroundColor: '#111827', color: 'white', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold' }}>Beverly Kiko Housing Uganda</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px' }}>
          <span>Switch View:</span>
          <button 
            onClick={() => setRole('tenant')} 
            style={{ padding: '6px 12px', background: role === 'tenant' ? '#0f766e' : '#374151', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            📱 Tenant Portal
          </button>
          <button 
            onClick={() => setRole('admin')} 
            style={{ padding: '6px 12px', background: role === 'admin' ? '#0f766e' : '#374151', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            🏢 Landlord Admin {notifications.length > 0 && `(${notifications.length})`}
          </button>
        </div>
      </div>

      {/* ================= TENANT VIEW ================= */}
      {role === 'tenant' && (
        <main style={{ maxWidth: '480px', margin: '30px auto', padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h2 style={{ margin: '0 0 6px 0', color: '#0f766e', fontSize: '20px' }}>Pay Your Rent</h2>
            <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '14px' }}>Select your unit and approve payment on your phone.</p>

            <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Select Your Housing Unit</label>
            <select 
              onChange={(e) => setSelectedUnit(initialProperties.find(p => p.id === e.target.value))}
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '16px' }}
            >
              {initialProperties.map(p => (
                <option key={p.id} value={p.id}>{p.title} - {p.tenant}</option>
              ))}
            </select>

            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', color: '#166534' }}>Monthly Rent Due</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#15803d' }}>UGX {selectedUnit.rentUgx.toLocaleString()}</div>
            </div>

            {paymentStatus === 'idle' && (
              <form onSubmit={handleTenantPayment}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Mobile Money Number</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g., 0770000000" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Select Provider</label>
                  <select 
                    value={provider} 
                    onChange={(e) => setProvider(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                  >
                    <option value="MTN Mobile Money">MTN Mobile Money</option>
                    <option value="Airtel Money">Airtel Money</option>
                  </select>
                </div>

                <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#0f766e', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                  Pay UGX {selectedUnit.rentUgx.toLocaleString()} Now
                </button>
              </form>
            )}

            {paymentStatus === 'processing' && (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f766e', marginBottom: '8px' }}>Sending Mobile Money Prompt...</div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Please check your phone (<strong>{phone}</strong>) and enter your PIN to authorize payment.</p>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <h3 style={{ color: '#16a34a', margin: '0 0 8px 0' }}>Payment Successful!</h3>
                <p style={{ color: '#4b5563', fontSize: '14px' }}>Thank you! Your rent receipt has been logged.</p>
                <button onClick={() => setPaymentStatus('idle')} style={{ padding: '10px 20px', background: '#0f766e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '12px' }}>
                  Back to Portal
                </button>
              </div>
            )}
          </div>
        </main>
      )}

      {/* ================= LANDLORD / ADMIN VIEW ================= */}
      {role === 'admin' && (
        <main style={{ maxWidth: '900px', margin: '30px auto', padding: '20px' }}>
          {/* Notifications Alert Banner */}
          {notifications.length > 0 && (
            <div style={{ backgroundColor: '#fef3c7', borderLeft: '4px solid #f59e0b', padding: '16px', borderRadius: '6px', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#92400e' }}>Payment Alerts Received</h4>
              {notifications.map((note, idx) => (
                <div key={idx} style={{ fontSize: '14px', color: '#78350f', margin: '4px 0' }}>{note}</div>
              ))}
            </div>
          )}

          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h2 style={{ margin: '0 0 16px 0', color: '#111827' }}>Landlord Payment Collections</h2>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px' }}>Transaction ID</th>
                  <th style={{ padding: '12px' }}>Unit</th>
                  <th style={{ padding: '12px' }}>Amount</th>
                  <th style={{ padding: '12px' }}>Provider</th>
                  <th style={{ padding: '12px' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{t.id}</td>
                    <td style={{ padding: '12px' }}>{t.unit}</td>
                    <td style={{ padding: '12px', color: '#16a34a', fontWeight: 'bold' }}>UGX {t.amount.toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>{t.provider}</td>
                    <td style={{ padding: '12px', color: '#6b7280' }}>{t.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      )}

    </div>
  );
}