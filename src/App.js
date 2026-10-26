import React, { useState } from 'react';

const initialProperties = [
  { id: 'PROP-101', title: 'Beverly Heights - Unit A1', location: 'Kololo, Kampala', rentUgx: 1800000, status: 'Occupied', tenant: 'Abram Carter', phone: '+256770000001' },
  { id: 'PROP-102', title: 'Beverly Suites - Unit B4', location: 'Naalya, Kampala', rentUgx: 850000, status: 'Occupied', tenant: 'Kiko Housing', phone: '+256750000002' },
  { id: 'PROP-103', title: 'Beverly Manor - Unit C2', location: 'Ntinda, Kampala', rentUgx: 1200000, status: 'Vacant', tenant: 'N/A', phone: 'N/A' },
  { id: 'PROP-104', title: 'Beverly Villa - Unit 05', location: 'Muyenga, Kampala', rentUgx: 2500000, status: 'Occupied', tenant: 'Sarah N', phone: '+256780000003' },
  { id: 'PROP-105', title: 'Beverly Haven - Unit D1', location: 'Entebbe Road', rentUgx: 950000, status: 'Pending Maintenance', tenant: 'David O', phone: '+256700000004' },
];

const initialTransactions = [
  { id: 'TXN-9021', property: 'Beverly Heights - Unit A1', tenant: 'Abram Carter', amount: 1800000, provider: 'MTN Mobile Money', date: '2026-10-24' },
  { id: 'TXN-9022', property: 'Beverly Suites - Unit B4', tenant: 'Kiko Housing', amount: 850000, provider: 'Airtel Money', date: '2026-10-22' },
  { id: 'TXN-9023', property: 'Beverly Villa - Unit 05', tenant: 'Sarah N', amount: 2500000, provider: 'MTN Mobile Money', date: '2026-10-15' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [properties] = useState(initialProperties);
  const [transactions, setTransactions] = useState(initialTransactions);
  
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentProvider, setPaymentProvider] = useState('MTN Mobile Money');
  const [paymentStep, setPaymentStep] = useState('input');

  const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  const handlePayRent = (e) => {
    e.preventDefault();
    setPaymentStep('processing');

    setTimeout(() => {
      const newTxn = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        property: selectedProperty.title,
        tenant: selectedProperty.tenant !== 'N/A' ? selectedProperty.tenant : 'Direct Payment',
        amount: selectedProperty.rentUgx,
        provider: paymentProvider,
        date: new Date().toISOString().split('T')[0],
      };

      setTransactions([newTxn, ...transactions]);
      setPaymentStep('success');
    }, 2000);
  };

  const closeModal = () => {
    setSelectedProperty(null);
    setPaymentStep('input');
    setPaymentPhone('');
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh', color: '#1f2937' }}>
      <header style={{ backgroundColor: '#0f766e', color: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Beverly Kiko Housing Uganda</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9 }}>Property & Rent Management System</p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '14px' }}>
          <span style={{ fontWeight: '600', display: 'block' }}>Admin Dashboard</span>
          <span style={{ fontSize: '12px', opacity: 0.8 }}>Kampala, Uganda</span>
        </div>
      </header>

      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 24px', display: 'flex', gap: '24px' }}>
        {['overview', 'properties', 'transactions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '14px 4px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === tab ? '3px solid #0f766e' : '3px solid transparent',
              color: activeTab === tab ? '#0f766e' : '#6b7280',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              textTransform: 'capitalize',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Total Units</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{properties.length}</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Occupied Units</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
              {properties.filter(p => p.status === 'Occupied').length}
            </div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Total Rent Collected</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f766e' }}>
              UGX {totalRevenue.toLocaleString()}
            </div>
          </div>
        </div>

        {activeTab !== 'transactions' ? (
          <section style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', margin: '0 0 16px 0', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
              Managed Properties & Mobile Rent Collection
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {properties.map((property) => (
                <div key={property.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', backgroundColor: '#fafafa' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{property.title}</h3>
                  <p style={{ margin: '4px 0', color: '#6b7280', fontSize: '14px' }}>📍 {property.location}</p>
                  <p style={{ margin: '4px 0', fontSize: '14px', fontWeight: 'bold', color: '#0f766e' }}>
                    Rent: UGX {property.rentUgx.toLocaleString()} / mo
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '13px', color: '#4b5563' }}>
                    Tenant: <strong>{property.tenant}</strong> ({property.phone})
                  </p>
                  <button
                    onClick={() => setSelectedProperty(property)}
                    style={{
                      marginTop: '12px',
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#0f766e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Collect Rent via Mobile Money
                  </button>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', margin: '0 0 16px 0', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
              Recent Rent Transactions
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px' }}>Transaction ID</th>
                  <th style={{ padding: '12px' }}>Property</th>
                  <th style={{ padding: '12px' }}>Tenant</th>
                  <th style={{ padding: '12px' }}>Provider</th>
                  <th style={{ padding: '12px' }}>Amount</th>
                  <th style={{ padding: '12px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{txn.id}</td>
                    <td style={{ padding: '12px' }}>{txn.property}</td>
                    <td style={{ padding: '12px' }}>{txn.tenant}</td>
                    <td style={{ padding: '12px' }}>{txn.provider}</td>
                    <td style={{ padding: '12px', color: '#16a34a', fontWeight: 'bold' }}>UGX {txn.amount.toLocaleString()}</td>
                    <td style={{ padding: '12px', color: '#6b7280' }}>{txn.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>

      {selectedProperty && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', width: '90%', maxWidth: '420px' }}>
            {paymentStep === 'input' && (
              <form onSubmit={handlePayRent}>
                <h3 style={{ marginTop: 0 }}>Pay Rent - {selectedProperty.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Amount Due: <strong>UGX {selectedProperty.rentUgx.toLocaleString()}</strong></p>
                
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Ugandan Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0770000000"
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Payment Provider</label>
                  <select
                    value={paymentProvider}
                    onChange={(e) => setPaymentProvider(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                  >
                    <option value="MTN Mobile Money">MTN Mobile Money</option>
                    <option value="Airtel Money">Airtel Money</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={closeModal} style={{ padding: '8px 16px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '8px 16px', background: '#0f766e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Send Prompt</button>
                </div>
              </form>
            )}

            {paymentStep === 'processing' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p style={{ fontWeight: 'bold' }}>Sending Mobile Money Prompt...</p>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>Please approve the PIN request on phone {paymentPhone}</p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <h3 style={{ color: '#16a34a' }}>Payment Received!</h3>
                <p style={{ fontSize: '14px' }}>Rent paid successfully via {paymentProvider}.</p>
                <button onClick={closeModal} style={{ padding: '8px 16px', background: '#0f766e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '12px' }}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}