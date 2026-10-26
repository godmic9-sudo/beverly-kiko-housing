import React, { useState, useRef } from 'react';
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

// --- GOSPEL MUSIC PLAYER COMPONENT ---
function GospelMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('Audio autoplay prevented:', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'rgba(15, 118, 110, 0.9)',
      backdropFilter: 'blur(8px)',
      color: 'white',
      padding: '10px 16px',
      borderRadius: '30px',
      boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      zIndex: 1000,
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      <audio 
        ref={audioRef} 
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=ambient-gospel-worship-113575.mp3" 
        loop 
      />
      <span style={{ fontSize: '13px', fontWeight: 'bold' }}>🎵 Gospel Music</span>
      <button 
        onClick={togglePlay} 
        style={{
          background: 'white',
          color: '#0f766e',
          border: 'none',
          borderRadius: '20px',
          padding: '4px 12px',
          fontWeight: 'bold',
          fontSize: '12px',
          cursor: 'pointer'
        }}
      >
        {isPlaying ? '⏸️ Pause' : '▶️ Play'}
      </button>
    </div>
  );
}

// --- TENANT PORTAL PAGE WITH CALENDAR & RECEIPT ---
function TenantPortal({ onNewPayment }) {
  const [selectedUnit, setSelectedUnit] = useState(initialProperties[0]);
  const [selectedMonths, setSelectedMonths] = useState(['Oct-2026']);
  const [phone, setPhone] = useState('');
  const [provider, setProvider] = useState('MTN Mobile Money');
  const [paymentStatus, setPaymentStatus] = useState('idle');
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
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.93)', backdropFilter: 'blur(10px)', borderRadius: '14px', padding: '26px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
        <h2 style={{ margin: '0 0 6px 0', color: '#0f766e', fontSize: '22px', fontWeight: 'bold' }}>Pay Rent Online</h2>
        <p style={{ margin: '0 0 20px 0', color: '#4b5563', fontSize: '14px' }}>Select your housing unit, tick the month(s), and pay via Mobile Money.</p>

        {paymentStatus === 'success' && latestReceipt ? (
          <div style={{ backgroundColor: '#ffffff', border: '2px dashed #0f766e', borderRadius: '10px', padding: '20px', marginTop: '10px' }}>
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
                <strong style={{ color: '#0f766e', textAlign: 'right', maxWidth: '200px' }}>{latestReceipt.monthsPaid}</strong>
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
          <>
            <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Select Your Housing Unit</label>
            <select 
              onChange={(e) => setSelectedUnit(initialProperties.find(p => p.id === e.target.value))}
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '20px', fontSize: '14px', backgroundColor: 'white' }}
            >
              {initialProperties.map(p => (
                <option key={p.id} value={p.id}>{p.title} - {p.tenant}</option>
              ))}
            </select>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                🗓️ Tick Month(s) You Are Paying For:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {availableMonths.map((m) => {
                  const isSelected = selectedMonths.includes(m.id);
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => toggleMonth(m.id)}
                      style={{
                        padding: '10px 6px',
                        borderRadius: '6px',
                        border: isSelected ? '2px solid #0f766e' : '1px solid #e5e7eb',
                        backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                        color: isSelected ? '#0f766e' : '#4b5563',
                        fontWeight: isSelected ? 'bold' : 'normal',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>{isSelected ? '✓' : '☐'}</span>
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', color: '#166534', marginBottom: '4px' }}>
                Selected: <strong>{selectedMonths.length} Month(s)</strong>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#15803d' }}>
                UGX {totalAmountDue.toLocaleString()}
              </div>
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
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px', backgroundColor: 'white' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Payment Network</label>
                  <select 
                    value={provider} 
                    onChange={(e) => setProvider(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', backgroundColor: 'white' }}
                  >
                    <option value="MTN Mobile Money">MTN Mobile Money</option>
                    <option value="Airtel Money">Airtel Money</option>
                  </select>
                </div>

                <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#0f766e', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                  Pay UGX {totalAmountDue.toLocaleString()} Now
                </button>
              </form>
            )}

            {paymentStatus === 'processing' && (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f766e', marginBottom: '8px' }}>Sending Mobile Money Prompt...</div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Please check your phone (<strong>{phone}</strong>) and enter your PIN to authorize payment for <strong>{selectedMonths.length} month(s)</strong>.</p>
              </div>
            )}
          </>
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
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.93)', backdropFilter: 'blur(10px)', borderRadius: '14px', padding: '28px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#111827', fontSize: '20px' }}>🔒 Landlord Portal Login</h2>
        <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '20px' }}>Authorized access only for property administrators.</p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Username</label>
            <input 
              type="text" 
              required
              placeholder="admin" 
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
        <h2 style={{ margin: 0, color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Landlord Control Panel</h2>
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

      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.93)', backdropFilter: 'blur(10px)', borderRadius: '14px', padding: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#374151' }}>Rent Collection History</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '12px' }}>Transaction ID</th>
              <th style={{ padding: '12px' }}>Tenant</th>
              <th style={{ padding: '12px' }}>Unit</th>
              <th style={{ padding: '12px' }}>Month(s) Paid</th>
              <th style={{ padding: '12px' }}>Amount</th>
              <th style={{ padding: '12px' }}>Network</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{t.id}</td>
                <td style={{ padding: '12px' }}>{t.tenant}</td>
                <td style={{ padding: '12px' }}>{t.unit}</td>
                <td style={{ padding: '12px', color: '#0f766e', fontWeight: '500' }}>{t.monthsPaid}</td>
                <td style={{ padding: '12px', color: '#16a34a', fontWeight: 'bold' }}>UGX {t.amount.toLocaleString()}</td>
                <td style={{ padding: '12px' }}>{t.provider}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

// --- MAIN APP COMPONENT ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [transactions, setTransactions] = useState([
    { id: 'TXN-9021', tenant: 'Abram Carter', unit: 'Beverly Heights - Unit A1', monthsPaid: 'September 2026', amount: 1800000, provider: 'MTN Mobile Money', time: 'Yesterday' }
  ]);

  const handleNewPayment = (newTxn) => {
    setTransactions(prev => [newTxn, ...prev]);
    setNotifications(prev => [`Payment Received: UGX ${newTxn.amount.toLocaleString()} from ${newTxn.tenant} for ${newTxn.monthsPaid} (${newTxn.unit})`, ...prev]);
  };

  return (
    <Router>
      <div style={{
        fontFamily: 'sans-serif',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        paddingBottom: '60px'
      }}>
        <header style={{ backgroundColor: 'rgba(15, 118, 110, 0.95)', backdropFilter: 'blur(8px)', color: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

        <GospelMusicPlayer />
      </div>
    </Router>
  );
}