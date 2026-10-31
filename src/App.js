import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('tenant');
  
  // Landlord Auth state
  const [landlordLoggedIn, setLandlordLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Units state
  const [units, setUnits] = useState([
    { id: '1', name: 'Beverly Heights - Unit A1', location: 'Kololo, Kampala', price: 1800000, tenant: 'Abram Carter (+256770000001)', occupied: true },
    { id: '2', name: 'Beverly Suites - Unit B4', location: 'Naalya, Kampala', price: 850000, tenant: 'Kiko Housing (+256750000002)', occupied: true },
    { id: '3', name: 'Beverly Manor - Unit C2', location: 'Ntinda, Kampala', price: 1200000, tenant: 'N/A (N/A)', occupied: false },
    { id: '4', name: 'Beverly Villa - Unit 05', location: 'Muyenga, Kampala', price: 2500000, tenant: 'N/A (N/A)', occupied: false },
    { id: '5', name: 'Beverly Haven - Unit D1', location: 'Entebbe Road', price: 950000, tenant: 'N/A (N/A)', occupied: false }
  ]);

  // Tenant Payment state
  const [selectedUnitId, setSelectedUnitId] = useState('1');
  const [selectedMonths, setSelectedMonths] = useState(['October 2026']);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentProvider, setPaymentProvider] = useState('MTN Mobile Money');
  const [paymentStep, setPaymentStep] = useState('form'); // form, processing, receipt
  const [receiptData, setReceiptData] = useState(null);
  const [notifications, setNotifications] = useState([
    'Payment Received: UGX 5,400,000 from Abram Carter for October 2026, August 2026, September 2026 (Beverly Heights - Unit A1)'
  ]);

  // Admin New Unit Form state
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newTenant, setNewTenant] = useState('');

  // Audio Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const monthsList = [
    'January 2026', 'February 2026', 'March 2026',
    'April 2026', 'May 2026', 'June 2026',
    'July 2026', 'August 2026', 'September 2026',
    'October 2026', 'November 2026', 'December 2026'
  ];

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const currentUnit = units.find(u => u.id === selectedUnitId) || units[0];
  const totalPrice = currentUnit.price * (selectedMonths.length || 1);

  const handleMonthToggle = (month) => {
    if (selectedMonths.includes(month)) {
      if (selectedMonths.length > 1) {
        setSelectedMonths(selectedMonths.filter(m => m !== month));
      }
    } else {
      setSelectedMonths([...selectedMonths, month]);
    }
  };

  const handlePaySubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setPaymentStep('processing');

    setTimeout(() => {
      const txId = 'TXN-' + Math.floor(1000 + Math.random() * 9000);
      const newReceipt = {
        txId,
        tenantName: currentUnit.tenant.includes('(') ? currentUnit.tenant.split('(')[0].trim() : 'Abram Carter',
        unitName: currentUnit.name,
        months: [...selectedMonths],
        network: paymentProvider,
        phone: phoneNumber,
        total: totalPrice,
        date: new Date().toLocaleString()
      };
      setReceiptData(newReceipt);
      setPaymentStep('receipt');

      const notifText = `Payment Received: UGX ${totalPrice.toLocaleString()} from ${newReceipt.tenantName} for ${selectedMonths.join(', ')} (${currentUnit.name})`;
      setNotifications([notifText, ...notifications]);
    }, 2500);
  };

  const handleLandlordLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setLandlordLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password (use admin / admin)');
    }
  };

  const handleAddUnit = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;
    const unitObj = {
      id: Date.now().toString(),
      name: newTitle,
      location: newLocation || 'Kampala, Uganda',
      price: Number(newPrice),
      tenant: newTenant || 'N/A',
      occupied: !!newTenant && newTenant !== 'N/A'
    };
    setUnits([...units, unitObj]);
    setNewTitle('');
    setNewLocation('');
    setNewPrice('');
    setNewTenant('');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'Inter, sans-serif', paddingBottom: '90px' }}>
      
      {/* Hidden Audio Element for Gospel Stream */}
      <audio 
        ref={audioRef} 
        src="https://stream.zeno.fm/f3wvbbqmdg8uv" 
        preload="none"
      />

      {/* Top Header */}
      <header style={{ backgroundColor: '#133e38', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Beverly Kiko Housing Uganda</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.8 }}>Mobile Money Rent Payment System</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setActiveTab('tenant')}
            style={{ 
              background: activeTab === 'tenant' ? '#1b5e55' : 'rgba(255,255,255,0.1)', 
              color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' 
            }}
          >
            🏢 Tenant Portal
          </button>
          <button 
            onClick={() => setActiveTab('landlord')}
            style={{ 
              background: activeTab === 'landlord' ? '#1b5e55' : 'rgba(255,255,255,0.1)', 
              color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' 
            }}
          >
            🔒 Landlord Portal
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '600px', margin: '24px auto', padding: '0 16px' }}>
        
        {/* TENANT PORTAL TAB */}
        {activeTab === 'tenant' && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            
            {paymentStep === 'form' && (
              <form onSubmit={handlePaySubmit}>
                <h2 style={{ fontSize: '22px', color: '#133e38', marginBottom: '8px' }}>Pay Rent Online</h2>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>Select your housing unit, tick your months, and pay via Mobile Money.</p>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#333' }}>Select Housing Unit</label>
                  <select 
                    value={selectedUnitId} 
                    onChange={(e) => setSelectedUnitId(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', backgroundColor: '#fff' }}
                  >
                    {units.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} - UGX {u.price.toLocaleString()}/mo ({u.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#333' }}>🗓️ Tick Month(s) You Are Paying For:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {monthsList.map(m => {
                      const isSelected = selectedMonths.includes(m);
                      return (
                        <div 
                          key={m}
                          onClick={() => handleMonthToggle(m)}
                          style={{ 
                            border: isSelected ? '2px solid #133e38' : '1px solid #ddd', 
                            borderRadius: '8px', 
                            padding: '10px 8px', 
                            textAlign: 'center', 
                            cursor: 'pointer', 
                            backgroundColor: isSelected ? '#eef4f3' : '#fafafa',
                            fontSize: '12px',
                            fontWeight: isSelected ? 'bold' : 'normal',
                            color: isSelected ? '#133e38' : '#444'
                          }}
                        >
                          <div style={{ marginBottom: '4px' }}>{isSelected ? '☑️' : '◻️'}</div>
                          {m}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ background: '#f8f9fa', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', color: '#666' }}>Selected: <strong>{selectedMonths.length} Month(s)</strong></div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#133e38', marginTop: '4px' }}>UGX {totalPrice.toLocaleString()}</div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#333' }}>Mobile Money Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 0770000000" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#333' }}>Payment Network</label>
                  <select 
                    value={paymentProvider}
                    onChange={(e) => setPaymentProvider(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', backgroundColor: '#fff' }}
                  >
                    <option value="MTN Mobile Money">MTN Mobile Money</option>
                    <option value="Airtel Money">Airtel Money</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  style={{ width: '100%', background: '#133e38', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Pay UGX {totalPrice.toLocaleString()} Now
                </button>
              </form>
            )}

            {paymentStep === 'processing' && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>📱</div>
                <h3 style={{ color: '#133e38', marginBottom: '8px' }}>Sending Mobile Money Prompt...</h3>
                <p style={{ color: '#666', fontSize: '14px' }}>Please check your phone ({phoneNumber}) and enter your PIN.</p>
              </div>
            )}

            {paymentStep === 'receipt' && receiptData && (
              <div style={{ border: '2px dashed #133e38', borderRadius: '12px', padding: '20px', backgroundColor: '#fafcfb' }}>
                <div style={{ textAlign: 'center', borderBottom: '1px solid #ddd', paddingBottom: '12px', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, color: '#133e38' }}>Beverly Kiko Housing Uganda</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>Official Rent Payment Receipt</p>
                  <div style={{ display: 'inline-block', backgroundColor: '#d1e7dd', color: '#0f5132', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', marginTop: '8px' }}>
                    PAID & VERIFIED ✓
                  </div>
                </div>

                <div style={{ fontSize: '13px', color: '#333', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Transaction ID:</span> <strong>{receiptData.txId}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tenant Name:</span> <strong>{receiptData.tenantName}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Housing Unit:</span> <strong>{receiptData.unitName}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Month(s) Covered:</span> <strong style={{ textAlign: 'right', maxWidth: '180px' }}>{receiptData.months.join(', ')}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Network:</span> <strong>{receiptData.network} ({receiptData.phone})</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Date & Time:</span> <strong>{receiptData.date}</strong></div>
                  <hr style={{ border: '0', borderTop: '1px solid #ddd', margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', color: '#133e38' }}><span>Total Paid:</span> <strong>UGX {receiptData.total.toLocaleString()}</strong></div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => window.print()}
                    style={{ flex: 1, backgroundColor: '#333', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                  >
                    🖨️ Print Receipt
                  </button>
                  <button 
                    onClick={() => setPaymentStep('form')}
                    style={{ flex: 1, backgroundColor: '#133e38', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                  >
                    New Payment
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* LANDLORD PORTAL TAB */}
        {activeTab === 'landlord' && (
          <div>
            {!landlordLoggedIn ? (
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <h2 style={{ fontSize: '20px', color: '#133e38', marginBottom: '4px' }}>🔒 Landlord Portal Login</h2>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>Authorized access for property administrators.</p>
                
                {loginError && <div style={{ backgroundColor: '#f8d7da', color: '#842029', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>{loginError}</div>}

                <form onSubmit={handleLandlordLogin}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Username</label>
                    <input 
                      type="text" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      placeholder="admin"
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Password</label>
                    <input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="admin"
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                  </div>
                  <button type="submit" style={{ width: '100%', backgroundColor: '#133e38', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Login to Admin Dashboard
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '20px', color: '#133e38', margin: 0 }}>Landlord Control Panel</h2>
                  <button onClick={() => setLandlordLoggedIn(false)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                    Logout
                  </button>
                </div>

                {/* Notifications Box */}
                <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffeeba', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#856404', marginBottom: '4px' }}>🔔 Live Rent Payment Notifications</div>
                  {notifications.map((n, idx) => (
                    <div key={idx} style={{ fontSize: '12px', color: '#533f03', marginTop: '4px' }}>• {n}</div>
                  ))}
                </div>

                {/* Add New Unit Form */}
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '15px', color: '#133e38', marginTop: 0, marginBottom: '12px' }}>➕ Add New Housing Unit</h3>
                  <form onSubmit={handleAddUnit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="Unit Title (e.g. Unit D3)" 
                      value={newTitle} 
                      onChange={(e) => setNewTitle(e.target.value)} 
                      required 
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                    />
                    <input 
                      type="text" 
                      placeholder="Location (e.g. Kololo)" 
                      value={newLocation} 
                      onChange={(e) => setNewLocation(e.target.value)} 
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                    />
                    <input 
                      type="number" 
                      placeholder="Monthly Rent (UGX)" 
                      value={newPrice} 
                      onChange={(e) => setNewPrice(e.target.value)} 
                      required 
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                    />
                    <input 
                      type="text" 
                      placeholder="Tenant Name & Phone (optional)" 
                      value={newTenant} 
                      onChange={(e) => setNewTenant(e.target.value)} 
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                    />
                    <button type="submit" style={{ backgroundColor: '#133e38', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                      Save Unit to System
                    </button>
                  </form>
                </div>

                {/* Existing Units List */}
                <h3 style={{ fontSize: '15px', color: '#133e38', marginBottom: '10px' }}>Managed Units ({units.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {units.map(u => (
                    <div key={u.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#133e38' }}>{u.name}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{u.location} • UGX {u.price.toLocaleString()}/mo</div>
                        <div style={{ fontSize: '11px', color: '#0f5132', marginTop: '2px' }}>Tenant: {u.tenant}</div>
                      </div>
                      <button 
                        onClick={() => setUnits(units.filter(item => item.id !== u.id))} 
                        style={{ background: '#ffcccc', color: '#990000', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>
        )}

      </main>

      {/* Floating Gospel Ambient Player Bar */}
      <div style={{ position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#133e38', color: 'white', padding: '10px 20px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 1000 }}>
        <div style={{ fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🎵 Gospel Ambient Player
        </div>
        <button 
          onClick={togglePlay}
          style={{ backgroundColor: 'white', color: '#133e38', border: 'none', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          {isPlaying ? '⏸️ Pause' : '▶ Play'}
        </button>
      </div>

    </div>
  );
}