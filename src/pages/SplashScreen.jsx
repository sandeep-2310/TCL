import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('enter'); // 'enter' -> 'hold' -> 'exit'
  const navigate = useNavigate();

  useEffect(() => {
    // Phase 1: Logo fades/scales in (0 → 700ms)
    const holdTimer = setTimeout(() => {
      setPhase('hold');
    }, 700);

    // Phase 2: Hold for a moment (700 → 2500ms)
    const exitTimer = setTimeout(() => {
      setPhase('exit');
    }, 2500);

    // Phase 3: Fade out, then navigate to login (2500 → 3200ms)
    const doneTimer = setTimeout(() => {
      onComplete(); // tell App to stop showing splash
      navigate('/login');
    }, 3200);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <div className={`splash-screen splash-${phase}`}>
      {/* Radial glow background */}
      <div className="splash-glow" />

      {/* Cross watermark */}
      <div className="splash-cross">†</div>

      {/* Logo */}
      <div className={`splash-logo-wrap splash-logo-${phase}`}>
        <img
          src="/logo.png"
          alt="Telugu Christian Literature"
          className="splash-logo-img"
          draggable={false}
        />
      </div>

      {/* App name below logo */}
      <div className={`splash-tagline splash-tagline-${phase}`}>
        <h1>Telugu Christian</h1>
        <h2>Literature</h2>
        <p>"Serving Faith with Love"</p>
      </div>

      {/* Loading dots */}
      <div className={`splash-dots splash-dots-${phase}`}>
        <span /><span /><span />
      </div>
    </div>
  );
};

export default SplashScreen;
