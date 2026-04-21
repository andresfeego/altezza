import { useEffect, useRef, useState } from 'react';

function SoundOnIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 10v4h4l5 4V6L7 10H3Z" fill="currentColor" />
      <path d="M16 9a5 5 0 0 1 0 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18.6 6.6a8.5 8.5 0 0 1 0 10.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SoundOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 10v4h4l5 4V6L7 10H3Z" fill="currentColor" />
      <path d="M16 9l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M21 9l-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function MusicPlayerView({ data, styles }) {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(Boolean(data?.initiallyMuted));

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const initialMuted = Boolean(data?.initiallyMuted);

    audio.loop = true;
    audio.muted = initialMuted;

    async function startPlayback() {
      try {
        audio.muted = initialMuted;
        await audio.play();
      } catch (_error) {
        try {
          // Fallback for browsers that only allow autoplay while muted.
          audio.muted = true;
          setIsMuted(true);
          await audio.play();
        } catch (_innerError) {
          audio.pause();
        }
      }
    }

    startPlayback();

    return undefined;
  }, [data?.audioSrc, data?.initiallyMuted]);

  async function handleMuteToggle() {
    const audio = audioRef.current;
    if (!audio) return;

    const nextMuted = !audio.muted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);

    if (audio.paused) {
      try {
        await audio.play();
      } catch (_error) {
        // Keep the control responsive even if the browser still blocks playback.
      }
    }
  }

  if (!data?.audioSrc) return null;

  return (
    <div className={styles.musicDock}>
      <audio ref={audioRef} preload="metadata" loop src={data.audioSrc} />
      <button
        type="button"
        className={styles.musicToggleButton}
        onClick={handleMuteToggle}
        aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
        title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
      >
        {isMuted ? <SoundOffIcon /> : <SoundOnIcon />}
      </button>
    </div>
  );
}
