import React, { useState, useRef } from 'react';
// Floating Gospel Ambient Player Component
function GospelAmbientPlayer() {
const [isPlaying, setIsPlaying] = useState(false);
const audioRef = useRef(null);
const togglePlay = () => {
if (audioRef.current) {
if (isPlaying) {
audioRef.current.pause();
} else {
audioRef.current.play().catch((e) => console.log('Audio playback info:', e));
}
setIsPlaying(!isPlaying);
}
};
return (
<div style={{
position: 'fixed',
bottom: '15px',
right: '15px',
backgroundColor: '#0c5c53',
color: 'white',
padding: '8px 14px',
borderRadius: '30px',
display: 'flex',
alignItems: 'center',
gap: '10px',
zIndex: 1000,
boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
border: '1px solid rgba(255,255,255,0.2)'
}}>
<audio 
ref={audioRef} 
loop 
src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
/>
<div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500' }}>
<span>🎵</span>
<span>Gospel Ambient Player</span>
</div>
<button
onClick={togglePlay}
style={{
backgroundColor: 'white',
color: '#0c5c53',
border: 'none',
borderRadius: '20px',
padding: '4px 12px',
fontSize: '12px',
fontWeight: 'bold',
cursor: 'pointer',
display: 'flex',
alignItems: 'center',
gap: '4px'
}}
>
{isPlaying ? '⏸️ Pause' : '▶ Play'}
</button>
</div>
);
}
export default function App() {
// Navigation & Authentication state
const [activePortal, setActivePortal] = useState('tenant'); // 'tenant' | 'landlord'
const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
const [adminPasswordInput, setAdminPasswordInput] = useState('');
const [authError, setAuthError] = useState('');
// Initial Housing Units State
const [units, setUnits] = useState([
{ id: 1, name: 'Beverly Heights - Unit A1', location: 'Kololo, Kampala', price: 1800000, tenant: 'Abram Carter', tenantPhone: '+256770000001', paidMonths: ['October 2026'] },
{ id: 2, name: 'Beverly Suites - Unit B4', location: 'Naalya, Kampala', price: 850000, tenant: 'Kiko Housing', tenantPhone: '+256750000002', paidMonths: ['September 2026'] },
{ id: 3, name: 'Beverly Manor - Unit C2', location: 'Ntinda, Kampala', price: 1200000, tenant: 'N/A', tenantPhone: '', paidMonths: [] },
{ id: 4, name: 'Beverly Villa - Unit 05', location: 'Muyenga, Kampala', price: 2500000, tenant: 'Sarah Musoke', tenantPhone: '+256780000003', paidMonths: ['October 2026', 'November 2026'] },
{ id: 5, name: 'Beverly Haven - Unit D1', location: 'Entebbe Road', price: 950000, tenant: 'N/A', tenantPhone: '', paidMonths: [] }
]);
// Tenant Payment Form State
const [selectedUnitId, setSelectedUnitId] = useState(1);
const [selectedMonths, setSelectedMonths] = useState(['October 2026']);
const [paymentProvider, setPaymentProvider] = useState('MTN'); // 'MTN' | 'AIRTEL'
const [phoneNumber, setPhoneNumber] = useState('0770000000');
const [isProcessingPayment, setIsProcessingPayment] = useState(false);
const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');
// Landlord Add Unit Form State
const [newUnitName, setNewUnitName] = useState('');
const [newUnitLocation, setNewUnitLocation] = useState('');
const [newUnitPrice, setNewUnitPrice] = useState('');
const [newUnitTenant, setNewUnitTenant] = useState('');
const monthsList = [
'January 2026', 'February 2026', 'March 2026',
'April 2026', 'May 2026', 'June 2026',
'July 2026', 'August 2026', 'September 2026',
'October 2026', 'November 2026', 'December 2026'
];
// Selected unit details
const selectedUnitObj = units.find(u => u.id === Number(selectedUnitId)) || units[0];
const totalPrice = (selectedUnitObj ? selectedUnitObj.price : 0) * selectedMonths.length;
// Handle Month Toggle for Tenant
const toggleMonth = (month) => {
if (selectedMonths.includes(month)) {
if (selectedMonths.length > 1) {
setSelectedMonths(selectedMonths.filter(m => m !== month));
}
} else {
setSelectedMonths([...selectedMonths, month]);
}
};
// Process Mobile Money Payment
const handleMobileMoneyPayment = (e) => {
e.preventDefault();
if (!phoneNumber) {
alert('Please enter a valid Mobile Money Phone Number.');
return;
}
setIsProcessingPayment(true);
setPaymentSuccessMsg('');
// Simulate USSD prompt & backend processing
setTimeout(() => {
setIsProcessingPayment(false);
// Record payment in state
setUnits(prevUnits => prevUnits.map(unit => {
if (unit.id === selectedUnitObj.id) {
const updatedMonths = Array.from(new Set([...unit.paidMonths, ...selectedMonths]));
return { ...unit, paidMonths: updatedMonths };
}
return unit;
}));
setPaymentSuccessMsg(⁠Success! Payment of UGX ${totalPrice.toLocaleString()} via ${paymentProvider} Money (${phoneNumber}) received for ${selectedUnitObj.name}. Receipt sent to your phone!⁠);
}, 2500);
};
// Handle Landlord Login
const handleAdminLogin = (e) => {
e.preventDefault();
if (adminPasswordInput === 'admin' || adminPasswordInput === '1234' || adminPasswordInput === 'beverly') {
setIsAdminLoggedIn(true);
setAuthError('');
} else {
setAuthError('Incorrect Password! (Default pass: admin)');
}
};
// Handle Add Unit by Landlord
const handleAddUnit = (e) => {
e.preventDefault();
if (!newUnitName || !newUnitPrice) {
alert('Please provide at least a unit name and monthly rent price.');
return;
}
const newUnit = {
id: Date.now(),
name: newUnitName,
location: newUnitLocation || 'Kampala, Uganda',
price: Number(newUnitPrice),
tenant: newUnitTenant || 'N/A',
tenantPhone: '',
paidMonths: []
};
setUnits([...units, newUnit]);
setNewUnitName('');
setNewUnitLocation('');
setNewUnitPrice('');
setNewUnitTenant('');
alert('New Housing Unit successfully added to system!');
};
// Total Rent Calculations for Admin
const totalUnitsCount = units.length;
const occupiedUnitsCount = units.filter(u => u.tenant && u.tenant !== 'N/A').length;
const totalRentCollected = units.reduce((sum, u) => sum + (u.price * u.paidMonths.length), 0);
return (
<div style={{
fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
backgroundColor: '#0d3834',
minHeight: '100vh',
color: '#1f2937',
paddingBottom: '90px'
}}>
{/* Top Header Banner */}
<header style={{
backgroundColor: '#0c5c53',
color: 'white',
padding: '20px 24px',
display: 'flex',
justify: 'space-between',
alignItems: 'center',
boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
}}>
<div>
<h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', letterSpacing: '-0.3px' }}>
Beverly Kiko Housing Uganda
</h1>
<p style={{ margin: '4px 0 0 0', fontSize: '13px', opacity: 0.9 }}>
Mobile Money Rent Payment & Management System
</p>
</div>
{/* Portal Switch Buttons */}
<div style={{ display: 'flex', gap: '12px' }}>
<button
onClick={() => setActivePortal('tenant')}
style={{
backgroundColor: activePortal === 'tenant' ? '#1b6b63' : '#111827',
color: 'white',
border: activePortal === 'tenant' ? '2px solid rgba(255,255,255,0.6)' : 'none',
borderRadius: '10px',
padding: '8px 16px',
cursor: 'pointer',
display: 'flex',
alignItems: 'center',
gap: '6px',
fontSize: '13px',
fontWeight: 'bold'
}}
>
<span>📱</span> Tenant Portal
</button>
<button
onClick={() => setActivePortal('landlord')}
style={{
backgroundColor: activePortal === 'landlord' ? '#1b6b63' : '#0f172a',
color: 'white',
border: activePortal === 'landlord' ? '2px solid rgba(255,255,255,0.6)' : 'none',
borderRadius: '10px',
padding: '8px 16px',
cursor: 'pointer',
display: 'flex',
alignItems: 'center',
gap: '6px',
fontSize: '13px',
fontWeight: 'bold'
}}
>
<span>🔒</span> Landlord Portal
</button>
</div>
</header>
{/* Main Content Area */}
<main style={{ maxWidth: '750px', margin: '24px auto', padding: '0 16px' }}>
{/* TENANT PORTAL */}
{activePortal === 'tenant' && (
<div style={{
backgroundColor: '#f8fafc',
borderRadius: '24px',
padding: '28px 24px',
boxShadow: '0 20px 40px rgba(0,0,0,0.35)'
}}>
<h2 style={{ color: '#0c5c53', margin: '0 0 6px 0', fontSize: '26px', fontWeight: '800' }}>
Pay Rent Online
</h2>
<p style={{ color: '#4b5563', margin: '0 0 24px 0', fontSize: '14px', lineHeight: '1.4' }}>
Select your housing unit, tick your months, and pay instantly via Mobile Money.
</p>
{/* Select Housing Unit Dropdown */}
<div style={{ marginBottom: '22px' }}>
<label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px', color: '#111827' }}>
Select Housing Unit
</label>
<select
value={selectedUnitId}
onChange={(e) => setSelectedUnitId(Number(e.target.value))}
style={{
width: '100%',
padding: '12px 14px',
borderRadius: '10px',
border: '1px solid #d1d5db',
backgroundColor: 'white',
fontSize: '14px',
outline: 'none',
cursor: 'pointer',
color: '#1f2937',
boxSizing: 'border-box'
}}
>
{units.map(unit => (
<option key={unit.id} value={unit.id}>
{unit.name} - UGX {unit.price.toLocaleString()}/mo ({unit.location})
</option>
))}
</select>
</div>
{/* Tick Month(s) Grid */}
<div style={{ marginBottom: '22px' }}>
<label style={{ display: 'block', fontWeight: 'bold', marginBottom: '12px', fontSize: '14px', color: '#111827' }}>
📅 Tick Month(s) You Are Paying For:
</label>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
{monthsList.map((month) => {
const isSelected = selectedMonths.includes(month);
const isAlreadyPaid = selectedUnitObj.paidMonths.includes(month);
const parts = month.split(' ');
return (
<div
key={month}
onClick={() => !isAlreadyPaid && toggleMonth(month)}
style={{
backgroundColor: isAlreadyPaid ? '#f3f4f6' : (isSelected ? '#e6f4f1' : 'white'),
border: isAlreadyPaid ? '1px dashed #9ca3af' : (isSelected ? '2px solid #0c5c53' : '1px solid #e5e7eb'),
borderRadius: '10px',
padding: '10px 4px',
textAlign: 'center',
cursor: isAlreadyPaid ? 'not-allowed' : 'pointer',
display: 'flex',
alignItems: 'center',
justify: 'center',
gap: '5px',
fontSize: '12px',
fontWeight: isSelected ? 'bold' : 'normal',
color: isAlreadyPaid ? '#9ca3af' : (isSelected ? '#0c5c53' : '#374151'),
minHeight: '52px',
boxSizing: 'border-box',
opacity: isAlreadyPaid ? 0.7 : 1
}}
>
<span style={{ fontSize: '14px' }}>
{isAlreadyPaid ? '🔒 Paid' : (isSelected ? '✓' : '▢')}
</span>
<span>{parts[0]}
{parts[1]}</span>
</div>
);
})}
</div>
</div>
{/* Price & Selection Summary Box */}
<div style={{
backgroundColor: '#e6f4f1',
padding: '16px',
borderRadius: '14px',
border: '1px solid #b2dfdb',
marginBottom: '22px'
}}>
<div style={{ fontSize: '13px', color: '#0c5c53', fontWeight: 'bold', marginBottom: '4px' }}>
Selected {selectedMonths.length} Month(s): {selectedMonths.join(', ')}
</div>
<div style={{ fontSize: '20px', fontWeight: '800', color: '#0c5c53' }}>
Total Rent: UGX {totalPrice.toLocaleString()}
</div>
</div>
{/* Mobile Money Checkout Form */}
<form onSubmit={handleMobileMoneyPayment} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '14px', border: '1px solid #e5e7eb' }}>
<h3 style={{ margin: '0 0 14px 0', fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>
💳 Mobile Money Checkout
</h3>
<div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
<button
type="button"
onClick={() => setPaymentProvider('MTN')}
style={{
flex: 1,
padding: '10px',
borderRadius: '8px',
border: paymentProvider === 'MTN' ? '2px solid #ffcc00' : '1px solid #d1d5db',
backgroundColor: paymentProvider === 'MTN' ? '#fff9e6' : 'white',
fontWeight: 'bold',
cursor: 'pointer',
fontSize: '13px'
}}
>
🟡 MTN Mobile Money
</button>
<button
type="button"
onClick={() => setPaymentProvider('AIRTEL')}
style={{
flex: 1,
padding: '10px',
borderRadius: '8px',
border: paymentProvider === 'AIRTEL' ? '2px solid #e60000' : '1px solid #d1d5db',
backgroundColor: paymentProvider === 'AIRTEL' ? '#ffe6e6' : 'white',
fontWeight: 'bold',
cursor: 'pointer',
fontSize: '13px'
}}
>
🔴 Airtel Money
</button>
</div>
<div style={{ marginBottom: '16px' }}>
<label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
Mobile Money Phone Number (+256):
</label>
<input
type="text"
value={phoneNumber}
onChange={(e) => setPhoneNumber(e.target.value)}
placeholder="0770000000"
required
style={{
width: '100%',
padding: '12px',
borderRadius: '8px',
border: '1px solid #d1d5db',
fontSize: '14px',
boxSizing: 'border-box'
}}
/>
</div>
<button
type="submit"
disabled={isProcessingPayment}
style={{
width: '100%',
backgroundColor: isProcessingPayment ? '#9ca3af' : '#0c5c53',
color: 'white',
border: 'none',
borderRadius: '10px',
padding: '14px',
fontSize: '15px',
fontWeight: 'bold',
cursor: isProcessingPayment ? 'not-allowed' : 'pointer'
}}
>
{isProcessingPayment ? '⏳ Prompting Mobile Money PIN...' : ⁠Pay UGX ${totalPrice.toLocaleString()} via ${paymentProvider}⁠}
</button>
</form>
{/* Payment Notification Alert */}
{paymentSuccessMsg && (
<div style={{
marginTop: '18px',
backgroundColor: '#dcfce7',
color: '#15803d',
padding: '14px',
borderRadius: '10px',
border: '1px solid #86efac',
fontSize: '14px',
lineHeight: '1.4'
}}>
{paymentSuccessMsg}
</div>
)}
</div>
)}
{/* LANDLORD / ADMIN PORTAL /}
{activePortal === 'landlord' && (
<div style={{
backgroundColor: '#f8fafc',
borderRadius: '24px',
padding: '28px 24px',
boxShadow: '0 20px 40px rgba(0,0,0,0.35)'
}}>
{!isAdminLoggedIn ? (
/ Password Protection Login Screen */
<div style={{ maxWidth: '360px', margin: '0 auto', textAlign: 'center' }}>
<div style={{ fontSize: '48px', marginBottom: '10px' }}>🔒</div>
<h2 style={{ color: '#0c5c53', margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold' }}>
Landlord Access Portal
</h2>
<p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '20px' }}>
Enter your password to access property management & financials.
</p>
<form onSubmit={handleAdminLogin}>
<input
type="password"
placeholder="Enter Landlord Password"
value={adminPasswordInput}
onChange={(e) => setAdminPasswordInput(e.target.value)}
style={{
width: '100%',
padding: '12px',
borderRadius: '8px',
border: '1px solid #d1d5db',
marginBottom: '12px',
fontSize: '14px',
textAlign: 'center',
boxSizing: 'border-box'
}}
/>
{authError && (
<p style={{ color: '#dc2626', fontSize: '12px', margin: '0 0 12px 0' }}>{authError}</p>
)}
<button
type="submit"
style={{
width: '100%',
backgroundColor: '#0c5c53',
color: 'white',
border: 'none',
borderRadius: '8px',
padding: '12px',
fontWeight: 'bold',
cursor: 'pointer'
}}
>
Unlock Dashboard
</button>
</form>
<p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '16px' }}>
(Default login password: <strong>admin</strong>)
</p>
</div>
) : (
/* Authenticated Landlord Admin Dashboard */
<div>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
<div>
<h2 style={{ color: '#0c5c53', margin: 0, fontSize: '24px', fontWeight: '800' }}>
Admin Dashboard
</h2>
<span style={{ fontSize: '12px', color: '#6b7280' }}>Kampala, Uganda</span>
</div>
<button
onClick={() => setIsAdminLoggedIn(false)}
style={{
backgroundColor: '#ef4444',
color: 'white',
border: 'none',
borderRadius: '6px',
padding: '6px 12px',
fontSize: '12px',
fontWeight: 'bold',
cursor: 'pointer'
}}
>
Lock Portal
</button>
</div>
{/* Dashboard Stats */}
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
<div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
<div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>Total Units</div>
<div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0c5c53', marginTop: '4px' }}>{totalUnitsCount}</div>
</div>
<div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
<div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>Occupied Units</div>
<div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669', marginTop: '4px' }}>{occupiedUnitsCount}</div>
</div>
<div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
<div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>Total Rent Collected</div>
<div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0c5c53', marginTop: '4px' }}>UGX {totalRentCollected.toLocaleString()}</div>
</div>
</div>
{/* Add New Housing Unit Section */}
<div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '14px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
<h3 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#0c5c53', fontWeight: 'bold' }}>
➕ Add New Housing Unit
</h3>
<form onSubmit={handleAddUnit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
<input
type="text"
placeholder="Unit Name (e.g. Beverly Suites - Unit B5)"
value={newUnitName}
onChange={(e) => setNewUnitName(e.target.value)}
required
style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
/>
<input
type="text"
placeholder="Location (e.g. Kololo, Kampala)"
value={newUnitLocation}
onChange={(e) => setNewUnitLocation(e.target.value)}
style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
/>
<input
type="number"
placeholder="Rent Price (UGX)"
value={newUnitPrice}
onChange={(e) => setNewUnitPrice(e.target.value)}
required
style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
/>
<input
type="text"
placeholder="Tenant Name (Optional)"
value={newUnitTenant}
onChange={(e) => setNewUnitTenant(e.target.value)}
style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
/>
<button
type="submit"
style={{
gridColumn: 'span 2',
backgroundColor: '#0c5c53',
color: 'white',
border: 'none',
borderRadius: '8px',
padding: '12px',
fontWeight: 'bold',
cursor: 'pointer'
}}
>
Save New Housing Unit
</button>
</form>
</div>
{/* Managed Units List */}
<h3 style={{ fontSize: '16px', color: '#111827', margin: '0 0 12px 0' }}>
Managed Housing Units & Rent Status
</h3>
<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
{units.map((unit) => (
<div key={unit.id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
<div>
<strong style={{ fontSize: '15px', color: '#111827' }}>{unit.name}</strong>
<div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>📍 {unit.location}</div>
<div style={{ fontSize: '13px', color: '#0c5c53', fontWeight: 'bold', marginTop: '4px' }}>
Rent: UGX {unit.price.toLocaleString()} / mo
</div>
<div style={{ fontSize: '12px', color: '#374151', marginTop: '4px' }}>
Tenant: <strong>{unit.tenant}</strong> {unit.tenantPhone && ⁠(${unit.tenantPhone})⁠}
</div>
</div>
<div style={{ textAlign: 'right' }}>
<span style={{
fontSize: '11px',
fontWeight: 'bold',
padding: '4px 8px',
borderRadius: '12px',
backgroundColor: unit.paidMonths.length > 0 ? '#dcfce7' : '#fee2e2',
color: unit.paidMonths.length > 0 ? '#15803d' : '#991b1b'
}}>
{unit.paidMonths.length > 0 ? ⁠${unit.paidMonths.length} Month(s) Paid⁠ : 'Unpaid'}
</span>
</div>
</div>
{unit.paidMonths.length > 0 && (
<div style={{ marginTop: '10px', fontSize: '11px', color: '#059669', backgroundColor: '#f0fdf4', padding: '6px 10px', borderRadius: '6px' }}>
Paid Months: {unit.paidMonths.join(', ')}
</div>
)}
</div>
))}
</div>
</div>
)}
</div>
)}
</main>
{/* Floating Audio Player */}
<GospelAmbientPlayer />
</div>
);
}