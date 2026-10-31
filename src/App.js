import React, { useState, useRef } from 'react';
// Gospel Ambient Player Floating Component
function GospelAmbientPlayer() {
const [isPlaying, setIsPlaying] = useState(false);
const audioRef = useRef(null);
const togglePlay = () => {
if (audioRef.current) {
if (isPlaying) {
audioRef.current.pause();
} else {
audioRef.current.play().catch(e => console.log('Audio playback info:', e));
}
setIsPlaying(!isPlaying);
}
};
return (
<div style={{
position: 'fixed',
bottom: '20px',
left: '50%',
transform: 'translateX(-50%)',
backgroundColor: '#1b6b63',
color: 'white',
padding: '8px 16px',
borderRadius: '30px',
display: 'flex',
alignItems: 'center',
gap: '12px',
zIndex: 1000,
boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
border: '1px solid rgba(255,255,255,0.2)'
}}>
<audio 
ref={audioRef} 
loop 
src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
/>
<div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500' }}>
<span>🎵</span>
<span>Gospel Ambient Player</span>
</div>
<button
onClick={togglePlay}
style={{
backgroundColor: 'white',
color: '#1b6b63',
border: 'none',
borderRadius: '20px',
padding: '4px 14px',
fontSize: '13px',
fontWeight: 'bold',
cursor: 'pointer',
display: 'flex',
alignItems: 'center',
gap: '4px'
}}
>
{isPlaying ? '⏸️ Pause' : '▶️ Play'}
</button>
</div>
);
}
export default function App() {
const [activePortal, setActivePortal] = useState('tenant'); // 'tenant' or 'landlord'
const [selectedUnit, setSelectedUnit] = useState('Beverly Heights - Unit A1 - UGX 1,800,000/m');
const [selectedMonths, setSelectedMonths] = useState(['October 2026']);
const monthsList = [
'January 2026', 'February 2026', 'March 2026',
'April 2026', 'May 2026', 'June 2026',
'July 2026', 'August 2026', 'September 2026',
'October 2026', 'November 2026', 'December 2026'
];
const toggleMonth = (month) => {
if (selectedMonths.includes(month)) {
setSelectedMonths(selectedMonths.filter(m => m !== month));
} else {
setSelectedMonths([...selectedMonths, month]);
}
};
return (
<div style={{
fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
backgroundColor: '#111827',
minHeight: '100vh',
color: '#1f2937',
paddingBottom: '80px'
}}>
{/* Top Header Banner */}
<header style={{
backgroundColor: '#0c5c53',
color: 'white',
padding: '20px 24px',
display: 'flex',
justify: 'space-between',
alignItems: 'center'
}}>
<div>
<h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>Beverly Kiko Housing Uganda</h1>
<p style={{ margin: '4px 0 0 0', fontSize: '13px', opacity: 0.85 }}>Mobile Money Rent Payment System</p>
</div>
{/* Portals Toggle Buttons */}
<div style={{ display: 'flex', gap: '12px' }}>
<button
onClick={() => setActivePortal('tenant')}
style={{
backgroundColor: activePortal === 'tenant' ? '#1b6b63' : '#1f2937',
color: 'white',
border: 'none',
borderRadius: '8px',
padding: '10px 16px',
textAlign: 'center',
cursor: 'pointer',
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
fontSize: '12px',
fontWeight: '600'
}}
>
<span style={{ fontSize: '14px', marginBottom: '2px' }}>📱</span>
Tenant Portal
</button>
<button
onClick={() => setActivePortal('landlord')}
style={{
backgroundColor: activePortal === 'landlord' ? '#1b6b63' : '#0f172a',
color: 'white',
border: 'none',
borderRadius: '8px',
padding: '10px 16px',
textAlign: 'center',
cursor: 'pointer',
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
fontSize: '12px',
fontWeight: '600'
}}
>
<span style={{ fontSize: '14px', marginBottom: '2px' }}>🔒</span>
Landlord Portal
</button>
</div>
</header>
{/* Main Content Area */}
<main style={{ maxWidth: '500px', margin: '24px auto', padding: '0 16px' }}>
<div style={{
backgroundColor: '#f3f4f6',
borderRadius: '24px',
padding: '28px 24px',
boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
}}>
<h2 style={{ color: '#0c5c53', margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold' }}>
Pay Rent Online
</h2>
<p style={{ color: '#4b5563', margin: '0 0 24px 0', fontSize: '14px', lineHeight: '1.4' }}>
Select your housing unit, tick your months, and pay via Mobile Money.
</p>
{/* Select Housing Unit Dropdown */}
<div style={{ marginBottom: '24px' }}>
<label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
Select Housing Unit
</label>
<select
value={selectedUnit}
onChange={(e) => setSelectedUnit(e.target.value)}
style={{
width: '100%',
padding: '12px 14px',
borderRadius: '8px',
border: '1px solid #d1d5db',
backgroundColor: 'white',
fontSize: '14px',
outline: 'none',
cursor: 'pointer'
}}
>
<option value="Beverly Heights - Unit A1 - UGX 1,800,000/m">Beverly Heights - Unit A1 - UGX 1,800,000/m</option>
<option value="Beverly Suites - Unit B4 - UGX 850,000/m">Beverly Suites - Unit B4 - UGX 850,000/m</option>
<option value="Beverly Manor - Unit C2 - UGX 1,200,000/m">Beverly Manor - Unit C2 - UGX 1,200,000/m</option>
<option value="Beverly Villa - Unit 05 - UGX 2,500,000/m">Beverly Villa - Unit 05 - UGX 2,500,000/m</option>
<option value="Beverly Haven - Unit D1 - UGX 950,000/m">Beverly Haven - Unit D1 - UGX 950,000/m</option>
</select>
</div>
{/* Month Selection Grid */}
<div style={{ marginBottom: '24px' }}>
<label style={{ display: 'block', fontWeight: 'bold', marginBottom: '12px', fontSize: '14px' }}>
📅 Tick Month(s) You Are Paying For:
</label>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
{monthsList.map((month) => {
const isSelected = selectedMonths.includes(month);
return (
<div
key={month}
onClick={() => toggleMonth(month)}
style={{
backgroundColor: isSelected ? '#e6f4f1' : 'white',
border: isSelected ? '2px solid #0c5c53' : '1px solid #e5e7eb',
borderRadius: '8px',
padding: '12px 6px',
textAlign: 'center',
cursor: 'pointer',
display: 'flex',
alignItems: 'center',
justify: 'center',
gap: '6px',
fontSize: '12px',
fontWeight: isSelected ? 'bold' : 'normal',
color: isSelected ? '#0c5c53' : '#374151',
minHeight: '44px',
boxSizing: 'border-box'
}}
>
<span>{isSelected ? '✓' : '▢'}</span>
<span>{month}</span>
</div>
);
})}
</div>
</div>
{/* Selection Summary Box */}
<div style={{ backgroundColor: '#e6f4f1', padding: '14px', borderRadius: '8px', border: '1px solid #b2dfdb' }}>
<div style={{ fontSize: '13px', color: '#0c5c53', fontWeight: 'bold' }}>
Selected {selectedMonths.length} Month(s): {selectedMonths.join(', ')}
</div>
</div>
</div>
</main>
{/* Floating Audio Player */}
<GospelAmbientPlayer />
</div>
);
}