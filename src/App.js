import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';

const initialProperties = [
  { id: 'PROP-101', title: 'Beverly Heights - Unit A1', location: 'Kololo, Kampala', rentUgx: 1800000, tenant: 'Abram Carter', phone: '0770000001' },
  { id: 'PROP-102', title: 'Beverly Suites - Unit B4', location: 'Naalya, Kampala', rentUgx: 850000, tenant: 'Kiko Housing', phone: '0750000002' },
  { id: 'PROP-103', title: 'Beverly Manor - Unit C2', location: 'Ntinda, Kampala', rentUgx: 1200000, tenant: 'N/A', phone: 'N/A' },
  { id: 'PROP-104', title: 'Beverly Villa - Unit 05', location: 'Muyenga, Kampala', rentUgx: 2500000, tenant: 'Sarah N', phone: '0780000003' },
];

// --- TENANT PORTAL PAGE ---
function TenantPortal({ onNewPayment }) {
  const [selectedUnit, setSelectedUnit] = useState(initialProperties[0]);
  const [phone, setPhone] = useState('');
  const [provider, setProvider] = useState('MTN Mobile Money');
  const [paymentStatus, setPaymentStatus] = useState('idle');

  const handleTenantPayment = (e) => {
    e.preventDefault();
    setPaymentStatus('processing');

    setTimeout(() => {
      const newTxn = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        unit: selectedUnit.title,
        tenant: selectedUnit.tenant,
        amount: selectedUnit.rentUgx,
        provider: provider,
        time: 'Just Now'
      };

      onNewPayment(newTxn);
      setPaymentStatus('success');
    }, 2500);
  };

  return (
    <main style={{ maxWidth: '480px', margin: '30px auto', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ margin: '0 0 6px 0', color: '#0f766e', fontSize: '20px' }}>Pay Rent Online</h2>
        <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '14px' }}>Select your housing unit and complete payment via Mobile Money.</p>

        <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Select Your Housing Unit</label>
        <select 
          onChange={(e) => setSelectedUnit(initialProperties.find(p => p.id === e.target.value))}
          style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '16px', fontSize: '14px' }}
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
              <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Mobile Money Phone Number</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. 0770000000" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Payment Network</label>
              <select 
                value={provider} 
                onChange={(e) => setProvider(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
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
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Please check your mobile phone (<strong>{phone}</strong>) and enter your PIN to approve the payment.</p>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <h3 style={{ color: '#16a34a', margin: '0 0 8px 0' }}>Payment Successful!</h3>
            <p style={{ color: '#4b5563', fontSize: '14px' }}>Thank you! Your rent payment has been logged and sent to the landlord.</p>
            <button onClick={() => setPaymentStatus('idle')} style={{ padding: '10px 20px', background: '#0f766e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '12px' }}>
              Back to Rent Portal
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

// --- LANDLORD ADMIN LOGIN PAGE ---
function AdminLogin({ isAuthenticated, setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Default credentials
    if (username === 'admin' && password === 'beverly2026') {
      setIsAuthenticated(true);
      setError(false);
      navigate('/admin');
    } else {
      setError(true);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <main style={{ maxWidth: '380px', margin: '50px auto', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#111827', fontSize: '20px' }}>🔒 Landlord Portal Login</h2>
        <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '20px' }}>Authorized access only for property administrators.</p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Username</label>
            <input 
              type="text" 
              required
              placeholder="e.g. admin" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Password</label>
            <input 
              type="password" 
              required
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '12px' }}>Invalid Username or Password!</p>}

          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#111827', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Login to Admin Dashboard
          </button>
        </form>
      </div>
    </main>
  );
}

// --- PROTECTED LANDLORD DASHBOARD PAGE ---
function AdminDashboard({ isAuthenticated, setIsAuthenticated, transactions, notifications }) {
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <main style={{ maxWidth: '900px', margin: '30px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#111827' }}>Landlord Control Panel</h2>
        <button 
          onClick={() => setIsAuthenticated(false)}
          style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
          Logout
        </button>
      </div>

      {notifications.length > 0 && (
        <div style={{ backgroundColor: '#fef3c7', borderLeft: '4px solid #f59e0b', padding: '16px', borderRadius: '6px', marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#92400e' }}>🔔 Live Rent Payment Notifications</h4>
          {notifications.map((note, idx) => (
            <div key={idx} style={{ fontSize: '14px', color: '#78350f', margin: '4px 0' }}>{note}</div>
          ))}
        </div>
      )}

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#374151' }}>Rent Collection History</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '12px' }}>Transaction ID</th>
              <th style={{ padding: '12px' }}>Unit</th>
              <th style={{ padding: '12px' }}>Amount</th>
              <th style={{ padding: '12px' }}>Network</th>
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
  );
}

// --- MAIN APP ROUTER ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [transactions, setTransactions] = useState([
    { id: 'TXN-9021', unit: 'Beverly Heights - Unit A1', amount: 1800000, provider: 'MTN Mobile Money', time: 'Yesterday' }
  ]);

  const handleNewPayment = (newTxn) => {
    setTransactions(prev => [newTxn, ...prev]);
    setNotifications(prev => [`Payment Received: UGX ${newTxn.amount.toLocaleString()} for ${newTxn.unit}`, ...prev]);
  };

  return (
    <Router>
      <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh', paddingBottom: '40px' }}>
        <header style={{ backgroundColor: '#0f766e', color: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Beverly Kiko Housing Uganda</h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9 }}>Mobile Money Rent Payment System</p>
          </div>
          
          <nav style={{ display: 'flex', gap: '12px' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', background: 'rgba(255,255,255,0.2)', padding: '8px 14px', borderRadius: '6px' }}>
              📱 Tenant Portal
            </Link>
            <Link to="/admin" style={{ color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', background: '#111827', padding: '8px 14px', borderRadius: '6px' }}>
              🔒 Landlord Portal
            </Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<TenantPortal onNewPayment={handleNewPayment} />} />
          <Route path="/admin/login" element={<AdminLogin isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/admin" element={<AdminDashboard isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} transactions={transactions} notifications={notifications} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}