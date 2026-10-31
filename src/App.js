import React, { useState } from 'react';
export default function App() {
const [activeTab, setActiveTab] = useState('home');
const properties = [
{
id: 1,
title: 'Modern Family Villa',
location: 'Prime Suburban Area',
price: '$450,000',
specs: '4 Beds • 3 Baths • 2,800 sqft',
image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'
},
{
id: 2,
title: 'Luxury Executive Suite',
location: 'Downtown City Center',
price: '$320,000',
specs: '2 Beds • 2 Baths • 1,350 sqft',
image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
},
{
id: 3,
title: 'Cozy Residential Apartment',
location: 'Quiet Neighborhood',
price: '$210,000',
specs: '2 Beds • 1 Bath • 950 sqft',
image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
}
];
return (
<div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1f2937', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
{/* Navigation Bar */}
<nav style={{ backgroundColor: '#0f766e', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
<h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Beverly Kiko Housing</h1>
<div style={{ display: 'flex', gap: '1.5rem' }}>
<button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', color: activeTab === 'home' ? '#5eead4' : 'white', cursor: 'pointer', fontWeight: '600' }}>Home</button>
<button onClick={() => setActiveTab('properties')} style={{ background: 'none', border: 'none', color: activeTab === 'properties' ? '#5eead4' : 'white', cursor: 'pointer', fontWeight: '600' }}>Properties</button>
<button onClick={() => setActiveTab('contact')} style={{ background: 'none', border: 'none', color: activeTab === 'contact' ? '#5eead4' : 'white', cursor: 'pointer', fontWeight: '600' }}>Contact</button>
</div>
</nav>
{/* Hero Header */}
<header style={{ backgroundColor: '#115e59', color: 'white', padding: '4rem 2rem', textAlign: 'center' }}>
<h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Find Your Perfect Dream Home</h2>
<p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>Comfortable, affordable, and luxurious housing options carefully curated for you and your family.</p>
<button onClick={() => setActiveTab('properties')} style={{ backgroundColor: '#0d9488', color: 'white', border: 'none', padding: '0.75rem 1.75rem', fontSize: '1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Explore Listings</button>
</header>
{/* Main Content Area */}
<main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
{activeTab === 'home' && (
<section>
<h3 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '2rem' }}>Featured Listings</h3>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
{properties.map((item) => (
<div key={item.id} style={{ backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
<img src={item.image} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
<div style={{ padding: '1.25rem' }}>
<h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{item.title}</h4>
<p style={{ color: '#6b7280', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{item.location}</p>
<p style={{ color: '#0d9488', fontWeight: 'bold', fontSize: '1.2rem', margin: '0 0 0.75rem 0' }}>{item.price}</p>
<p style={{ fontSize: '0.85rem', color: '#4b5563' }}>{item.specs}</p>
</div>
</div>
))}
</div>
</section>
)}
{activeTab === 'properties' && (
<section>
<h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>All Available Properties</h3>
<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
{properties.map((item) => (
<div key={item.id} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', flexWrap: 'wrap' }}>
<img src={item.image} alt={item.title} style={{ width: '180px', height: '120px', objectFit: 'cover', borderRadius: '6px' }} />
<div style={{ flex: '1' }}>
<h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{item.title}</h4>
<p style={{ color: '#6b7280', margin: '0 0 0.5rem 0' }}>{item.location}</p>
<p style={{ color: '#4b5563', margin: 0, fontSize: '0.9rem' }}>{item.specs}</p>
</div>
<div>
<span style={{ display: 'block', fontSize: '1.3rem', fontWeight: 'bold', color: '#0d9488', marginBottom: '0.5rem' }}>{item.price}</span>
<button style={{ backgroundColor: '#0f766e', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Inquire</button>
</div>
</div>
))}
</div>
</section>
)}
{activeTab === 'contact' && (
<section style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
<h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', textAlign: 'center' }}>Contact Us</h3>
<p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '1.5rem' }}>Get in touch with Beverly Kiko Housing specialists.</p>
<form onSubmit={(e) => { e.preventDefault(); alert('Thank you! We will get back to you soon.'); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
<div>
<label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Name</label>
<input required type="text" placeholder="Your full name" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
</div>
<div>
<label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
<input required type="email" placeholder="you@example.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
</div>
<div>
<label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Message</label>
<textarea required rows="4" placeholder="How can we help you?" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}></textarea>
</div>
<button type="submit" style={{ backgroundColor: '#0d9488', color: 'white', border: 'none', padding: '0.75rem', fontSize: '1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '0.5rem' }}>Send Message</button>
</form>
</section>
)}
</main>
{/* Footer */}
<footer style={{ backgroundColor: '#111827', color: '#9ca3af', textAlign: 'center', padding: '2rem 1rem', marginTop: '3rem' }}>
<p style={{ margin: 0 }}>© {new Date().getFullYear()} Beverly Kiko Housing Project. All rights reserved.</p>
</footer>
</div>
);
}