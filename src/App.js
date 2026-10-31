import React, { useState } from 'react';
export default function App() {
const [activeTab, setActiveTab] = useState('overview');
const stats = {
totalUnits: 5,
occupiedUnits: 3,
totalRentCollected: 'UGX 5,150,000'
};
const properties = [
{
id: 1,
title: 'Beverly Heights - Unit A1',
location: 'Kololo, Kampala',
rent: 'UGX 1,800,000 / mo',
tenant: 'Abram Carter (+256770000001)',
status: 'Occupied'
},
{
id: 2,
title: 'Beverly Suites - Unit B4',
location: 'Naalya, Kampala',
rent: 'UGX 850,000 / mo',
tenant: 'Kiko Housing (+256750000002)',
status: 'Occupied'
},
{
id: 3,
title: 'Beverly Manor - Unit C2',
location: 'Ntinda, Kampala',
rent: 'UGX 1,200,000 / mo',
tenant: 'N/A (N/A)',
status: 'Vacant'
},
{
id: 4,
title: 'Beverly Villa - Unit 05',
location: 'Muyenga, Kampala',
rent: 'UGX 2,500,000 / mo',
tenant: 'Sarah Namubiru (+256780000003)',
status: 'Occupied'
},
{
id: 5,
title: 'Beverly Haven - Unit D1',
location: 'Entebbe Road',
rent: 'UGX 950,000 / mo',
tenant: 'N/A (N/A)',
status: 'Vacant'
}
];
const transactions = [
{ id: 'TXN-9841', property: 'Beverly Heights - Unit A1', amount: 'UGX 1,800,000', date: '2026-10-15', method: 'MTN Mobile Money' },
{ id: 'TXN-9842', property: 'Beverly Suites - Unit B4', amount: 'UGX 850,000', date: '2026-10-12', method: 'Airtel Money' },
{ id: 'TXN-9843', property: 'Beverly Villa - Unit 05', amount: 'UGX 2,500,000', date: '2026-10-02', method: 'MTN Mobile Money' }
];
const handleMobileMoneyPayment = (propertyTitle) => {
alert(⁠Initiating Mobile Money Rent Collection request for: ${propertyTitle}⁠);
};
return (
<div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#eef2f5', minHeight: '100vh', color: '#2d3748' }}>
{/* Header Banner */}
<header style={{ backgroundColor: '#00796b', color: 'white', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
<div>
<h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>Beverly Kiko Housing Uganda</h1>
<p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', opacity: 0.9 }}>Property & Rent Management System</p>
</div>
<div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
<div style={{ fontWeight: 'bold' }}>Admin Dashboard</div>
<div style={{ opacity: 0.85 }}>Kampala, Uganda</div>
</div>
</header>
{/* Navigation Tabs */}
<div style={{ backgroundColor: '#e2e8f0', borderBottom: '1px solid #cbd5e0', padding: '0 2rem' }}>
<div style={{ display: 'flex', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
<button
onClick={() => setActiveTab('overview')}
style={{
padding: '0.9rem 0',
background: 'none',
border: 'none',
borderBottom: activeTab === 'overview' ? '3px solid #00796b' : '3px solid transparent',
color: activeTab === 'overview' ? '#00796b' : '#4a5568',
fontWeight: activeTab === 'overview' ? 'bold' : '500',
fontSize: '0.95rem',
cursor: 'pointer'
}}
>
Overview
</button>
<button
onClick={() => setActiveTab('properties')}
style={{
padding: '0.9rem 0',
background: 'none',
border: 'none',
borderBottom: activeTab === 'properties' ? '3px solid #00796b' : '3px solid transparent',
color: activeTab === 'properties' ? '#00796b' : '#4a5568',
fontWeight: activeTab === 'properties' ? 'bold' : '500',
fontSize: '0.95rem',
cursor: 'pointer'
}}
>
Properties
</button>
<button
onClick={() => setActiveTab('transactions')}
style={{
padding: '0.9rem 0',
background: 'none',
border: 'none',
borderBottom: activeTab === 'transactions' ? '3px solid #00796b' : '3px solid transparent',
color: activeTab === 'transactions' ? '#00796b' : '#4a5568',
fontWeight: activeTab === 'transactions' ? 'bold' : '500',
fontSize: '0.95rem',
cursor: 'pointer'
}}
>
Transactions
</button>
</div>
</div>
{/* Main Container */}
<main style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 2rem' }}>
{/* Metric Cards */}
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
<div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
<span style={{ fontSize: '0.85rem', color: '#718096', fontWeight: '500' }}>Total Units</span>
<div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3748', marginTop: '0.25rem' }}>{stats.totalUnits}</div>
</div>
<div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
<span style={{ fontSize: '0.85rem', color: '#718096', fontWeight: '500' }}>Occupied Units</span>
<div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2b6cb0', marginTop: '0.25rem' }}>{stats.occupiedUnits}</div>
</div>
<div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
<span style={{ fontSize: '0.85rem', color: '#718096', fontWeight: '500' }}>Total Rent Collected</span>
<div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00796b', marginTop: '0.25rem' }}>{stats.totalRentCollected}</div>
</div>
</div>
{/* Overview Tab Content */}
{activeTab === 'overview' && (
<section>
<h2 style={{ fontSize: '1.1rem', color: '#4a5568', marginBottom: '1.25rem', fontWeight: '600' }}>
Managed Properties & Mobile Rent Collection
</h2>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
{properties.map((item) => (
<div key={item.id} style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
<div>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
<h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1rem', fontWeight: 'bold', color: '#2d3748' }}>{item.title}</h3>
<span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: item.status === 'Occupied' ? '#e6fffa' : '#edf2f7', color: item.status === 'Occupied' ? '#047857' : '#718096', fontWeight: 'bold' }}>
{item.status}
</span>
</div>
<p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#718096' }}>📍 {item.location}</p>
<p style={{ margin: '0 0 0.3rem 0', fontSize: '0.9rem', color: '#00796b', fontWeight: 'bold' }}>Rent: {item.rent}</p>
<p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: '#a0aec0' }}>Tenant: {item.tenant}</p>
</div>
<button
onClick={() => handleMobileMoneyPayment(item.title)}
style={{
width: '100%',
backgroundColor: '#00796b',
color: 'white',
border: 'none',
padding: '0.6rem',
borderRadius: '6px',
fontSize: '0.85rem',
fontWeight: 'bold',
cursor: 'pointer',
transition: 'background-color 0.2s'
}}
>
Collect Rent via Mobile Money
</button>
</div>
))}
</div>
</section>
)}
{/* Properties Tab Content */}
{activeTab === 'properties' && (
<section style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
<h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#2d3748' }}>All Property Records</h2>
<table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
<thead>
<tr style={{ borderBottom: '2px solid #e2e8f0', color: '#718096' }}>
<th style={{ padding: '0.75rem' }}>Property</th>
<th style={{ padding: '0.75rem' }}>Location</th>
<th style={{ padding: '0.75rem' }}>Monthly Rent</th>
<th style={{ padding: '0.75rem' }}>Tenant Info</th>
<th style={{ padding: '0.75rem' }}>Status</th>
</tr>
</thead>
<tbody>
{properties.map((p) => (
<tr key={p.id} style={{ borderBottom: '1px solid #edf2f7' }}>
<td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{p.title}</td>
<td style={{ padding: '0.75rem' }}>{p.location}</td>
<td style={{ padding: '0.75rem', color: '#00796b', fontWeight: 'bold' }}>{p.rent}</td>
<td style={{ padding: '0.75rem' }}>{p.tenant}</td>
<td style={{ padding: '0.75rem' }}>{p.status}</td>
</tr>
))}
</tbody>
</table>
</section>
)}
{/* Transactions Tab Content */}
{activeTab === 'transactions' && (
<section style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
<h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#2d3748' }}>Recent Mobile Money Collections</h2>
<table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
<thead>
<tr style={{ borderBottom: '2px solid #e2e8f0', color: '#718096' }}>
<th style={{ padding: '0.75rem' }}>Transaction ID</th>
<th style={{ padding: '0.75rem' }}>Property</th>
<th style={{ padding: '0.75rem' }}>Amount</th>
<th style={{ padding: '0.75rem' }}>Payment Method</th>
<th style={{ padding: '0.75rem' }}>Date</th>
</tr>
</thead>
<tbody>
{transactions.map((t) => (
<tr key={t.id} style={{ borderBottom: '1px solid #edf2f7' }}>
<td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{t.id}</td>
<td style={{ padding: '0.75rem', fontWeight: '500' }}>{t.property}</td>
<td style={{ padding: '0.75rem', color: '#00796b', fontWeight: 'bold' }}>{t.amount}</td>
<td style={{ padding: '0.75rem' }}>{t.method}</td>
<td style={{ padding: '0.75rem', color: '#718096' }}>{t.date}</td>
</tr>
))}
</tbody>
</table>
</section>
)}
</main>
</div>
);
}