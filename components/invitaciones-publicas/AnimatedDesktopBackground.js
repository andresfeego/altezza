import { useEffect, useRef } from 'react';
import styles from './AnimatedDesktopBackground.module.scss';

export default function AnimatedDesktopBackground({ children, className = '' }) {
  const particlesCanvasRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const canvas = particlesCanvasRef.current;
    if (!isDesktop || !canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let particles = [];
    let width = 0;
    let height = 0;
    let frameId = null;

    const rand = (min, max) => Math.random() * (max - min) + min;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const createParticle = () => ({
      x: rand(0, width),
      y: rand(0, height),
      r: rand(0.4, 1.8),
      vx: rand(-0.15, 0.15),
      vy: rand(-0.3, -0.05),
      alpha: rand(0.1, 0.55),
      life: rand(0, 1),
      speed: rand(0.003, 0.008),
    });

    resize();
    particles = Array.from({ length: 90 }, () => createParticle());

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((particle, index) => {
        particle.life += particle.speed;
        if (particle.life > 1) {
          particles[index] = createParticle();
          particle.life = 0;
        }

        const alpha = particle.alpha * Math.sin(particle.life * Math.PI);
        ctx.beginPath();
        ctx.arc(
          particle.x + particle.vx * particle.life * 200,
          particle.y + particle.vy * particle.life * 200,
          particle.r,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(201, 169, 110, ${alpha})`;
        ctx.fill();
      });

      frameId = window.requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className={`${styles.host} ${className}`.trim()}>
      <canvas ref={particlesCanvasRef} className={styles.particles} aria-hidden="true" />
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.foreground}>
        {children}
      </div>
    </div>
  );
}
