import React, { useState } from 'react';

function App() {
  const [view, setView] = useState('tenant'); // 'tenant' or 'admin'
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Tenant Form State
  const [tenantName, setTenantName] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Set your secret Admin PIN here (e.g. '1234' or your custom passcode)
  const ADMIN_PIN = '1234';

  // Sample ledger records for Admin View
  const [payments] = useState([
    { id: 1, tenant: 'John Mugisha', house: 'Unit 4B', amount: 450000, date: '2026-10-20', status: 'PAID' },
    { id: 2, tenant: 'Sarah Musoke', house: 'Unit 2A', amount: 500000, date: '2026-10-22', status: 'PAID' }
  ]);

  const handleMtnPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage('Initiating MTN MoMo Prompt...');

    try {
      const response = await fetch('https://your-backend-api.onrender.com/api/pay-mtn-rent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantName, houseNo, phone, amount }),
      });

      const data = await response.json();
      if (data.success) {
        setStatusMessage('📱 Check your phone! Enter your MTN MoMo PIN to complete payment.');
      } else {
        setStatusMessage('❌ Error initiating payment. Please check phone number.');
      }
    } catch (err) {
      setStatusMessage('❌ Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPinInput === ADMIN_PIN) {
      setIsAdminAuthenticated(true);
      setView('admin');
      setPinError('');
      setAdminPinInput('');
    } else {
      setPinError('Incorrect Admin PIN. Access Denied.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setView('tenant');
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', margin: 0 }}>
      {/* Navigation Header */}
      <nav style={{ backgroundColor: '#0f172a', padding: '1rem 2rem', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
          BEVERLY AND KIKO HOUSING PROPERTY UGANDA
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setView('tenant')} 
            style={{ padding: '8px 16px', backgroundColor: view === 'tenant' ? '#2563eb' : '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Tenant Portal
          </button>
          
          {isAdminAuthenticated ? (
            <button 
              onClick={handleAdminLogout} 
              style={{ padding: '8px 16px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Logout Admin
            </button>
          ) : (
            <button 
              onClick={() => setView('admin_login')} 
              style={{ padding: '8px 16px', backgroundColor: view === 'admin_login' || view === 'admin' ? '#2563eb' : '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Admin Login
            </button>
          )}
        </div>
      </nav>

      {/* Main Container */}
      <main style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
        {view === 'tenant' && (
          /* TENANT PORTAL VIEW */
          <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0, color: '#1e293b' }}>Pay Rent via MTN Mobile Money</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Enter details below to receive a direct payment prompt on your MTN phone screen.</p>

            <form onSubmit={handleMtnPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.4rem', color: '#334155' }}>Tenant Full Name</label>
                <input type="text" placeholder="e.g. John Mugisha" value={tenantName} onChange={(e) => setTenantName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.4rem', color: '#334155' }}>House / Unit Number</label>
                <input type="text" placeholder="e.g. Unit 4B" value={houseNo} onChange={(e) => setHouseNo(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.4rem', color: '#334155' }}>MTN Phone Number</label>
                <input type="tel" placeholder="077... or 078..." value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.4rem', color: '#334155' }}>Amount (UGX)</label>
                <input type="number" placeholder="450000" value={amount} onChange={(e) => setAmount(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>

              <button type="submit" disabled={loading} style={{ padding: '12px', backgroundColor: '#ffcc00', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' }}>
                {loading ? 'Sending Prompt...' : 'PAY RENT VIA MTN MOMO'}
              </button>
            </form>

            {statusMessage && (
              <div style={{ marginTop: '1rem', padding: '10px', backgroundColor: '#f1f5f9', borderRadius: '6px', textAlign: 'center', fontWeight: 'bold' }}>
                {statusMessage}
              </div>
            )}
          </div>
        )}

        {view === 'admin_login' && !isAdminAuthenticated && (
          /* ADMIN LOGIN FORM GATEWAY */
          <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <h2 style={{ marginTop: 0, color: '#1e293b' }}>Administrator Login</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Restricted Area. Please enter your secret Administrator PIN to access property management records.</p>

            <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem', maxWidth: '300px', margin: '1.5rem auto 0' }}>
              <input 
                type="password" 
                placeholder="Enter Admin PIN" 
                value={adminPinInput} 
                onChange={(e) => setAdminPinInput(e.target.value)} 
                required 
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', textAlign: 'center', fontSize: '1.1rem', boxSizing: 'border-box' }}
              />

              <button type="submit" style={{ padding: '12px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                UNLOCK DASHBOARD
              </button>
            </form>

            {pinError && (
              <p style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1rem', fontSize: '0.9rem' }}>{pinError}</p>
            )}
          </div>
        )}

        {view === 'admin' && isAdminAuthenticated && (
          /* PROTECTED ADMIN DASHBOARD VIEW */
          <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ marginTop: 0, color: '#1e293b' }}>Property Overview & Collections</h2>
              <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                🔒 Secure Admin Mode
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', marginTop: '1rem' }}>
              <div style={{ flex: 1, backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
                <span style={{ fontSize: '0.85rem', color: '#1e40af' }}>Total Rent Collected</span>
                <h3 style={{ margin: '0.5rem 0 0', color: '#1e3a8a' }}>UGX 950,000</h3>
              </div>
              <div style={{ flex: 1, backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #16a34a' }}>
                <span style={{ fontSize: '0.85rem', color: '#166534' }}>Occupied Units</span>
                <h3 style={{ margin: '0.5rem 0 0', color: '#14532d' }}>8 / 10</h3>
              </div>
            </div>

            <h3 style={{ fontSize: '1rem', color: '#334155', marginBottom: '0.5rem' }}>Recent Payment Ledger</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '8px' }}>Tenant</th>
                  <th style={{ padding: '8px' }}>House</th>
                  <th style={{ padding: '8px' }}>Amount</th>
                  <th style={{ padding: '8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px', fontWeight: '500' }}>{p.tenant}</td>
                    <td style={{ padding: '8px' }}>{p.house}</td>
                    <td style={{ padding: '8px' }}>UGX {p.amount.toLocaleString()}</td>
                    <td style={{ padding: '8px' }}>
                      <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
