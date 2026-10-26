function GospelMusicPlayer() {
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
      right: '20px',
      backgroundColor: 'rgba(15, 118, 110, 0.95)',
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
      {/* --- UPDATE THIS LINE TO YOUR LOCAL FILE --- */}
      <audio 
        ref={audioRef} 
        src="<audio 
  ref={audioRef} 
  src="https://www.ceenaija.com/wp-content/uploads/2024/09/Grace_Idowu_-_God_Dont_Give_Up_On_Me_Yet_CeeNaija.com_.mp3" 
  loop 
/> 
      />
      
      <span style={{ fontSize: '13px', fontWeight: 'bold' }}>🎵 Grace Idowu - Don't Give Up On Me</span>
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