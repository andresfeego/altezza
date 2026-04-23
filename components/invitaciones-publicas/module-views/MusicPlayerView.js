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
    const syncMutedState = () => setIsMuted(Boolean(audio.muted));

    audio.loop = true;
    audio.muted = initialMuted;
    syncMutedState();

    async function startPlayback() {
      try {
        audio.muted = initialMuted;
        await audio.play();
        syncMutedState();
      } catch (_error) {
        audio.pause();
        syncMutedState();
      }
    }

    if (Boolean(data?.autoplay)) {
      startPlayback();
    }

    async function startOnFirstInteraction() {
      if (!initialMuted && audio.muted) {
        audio.muted = false;
      }

      if (!audio.paused) {
        syncMutedState();
        return;
      }

      try {
        if (!initialMuted) {
          audio.muted = false;
        } else {
          audio.muted = true;
        }
        await audio.play();
        syncMutedState();
      } catch (_error) {
        // Browser policy can still block playback until a stronger gesture.
        syncMutedState();
      }
    }

    async function playUnmute() {
      // eslint-disable-next-line no-console
      console.debug('[music] playUnmute called');
      audio.muted = false;
      setIsMuted(false);
      try {
        await audio.play();
        // eslint-disable-next-line no-console
        console.debug('[music] playUnmute -> audio.play resolved');
        interactionEvents.forEach((eventName) => {
          window.removeEventListener(eventName, startOnFirstInteraction);
        });
      } catch (_error) {
        // eslint-disable-next-line no-console
        console.debug('[music] playUnmute -> audio.play blocked', _error);
        // Browser may still require a stronger user interaction.
      }
    }

    function mute() {
      audio.muted = true;
      setIsMuted(true);
    }

    function unmute() {
      audio.muted = false;
      setIsMuted(false);
    }

    async function toggleMute() {
      // eslint-disable-next-line no-console
      console.debug('[music] toggleMute called');
      const nextMuted = !audio.muted;
      audio.muted = nextMuted;
      setIsMuted(nextMuted);
      // eslint-disable-next-line no-console
      console.debug('[music] toggleMute -> muted:', nextMuted);
      if (audio.paused) {
        try {
          await audio.play();
          // eslint-disable-next-line no-console
          console.debug('[music] toggleMute -> resumed playback');
        } catch (_error) {
          // eslint-disable-next-line no-console
          console.debug('[music] toggleMute -> resume blocked', _error);
          // noop
        }
      }
    }

    function handleEnvelopOpen() {
      playUnmute();
    }

    audio.addEventListener('volumechange', syncMutedState);
    audio.addEventListener('play', syncMutedState);
    audio.addEventListener('pause', syncMutedState);
    window.addEventListener('envelopIntro:open', handleEnvelopOpen);
    window.__invMusicControls = {
      playUnmute,
      mute,
      unmute,
      toggleMute,
    };

    const interactionEvents = ['pointerdown', 'touchstart', 'keydown'];
    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, startOnFirstInteraction, { once: true, passive: true });
    });

    return () => {
      audio.removeEventListener('volumechange', syncMutedState);
      audio.removeEventListener('play', syncMutedState);
      audio.removeEventListener('pause', syncMutedState);
      window.removeEventListener('envelopIntro:open', handleEnvelopOpen);
      if (window.__invMusicControls?.playUnmute === playUnmute) {
        delete window.__invMusicControls;
      }
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, startOnFirstInteraction);
      });
    };
  }, [data?.audioSrc, data?.autoplay, data?.initiallyMuted]);

  async function handleMuteToggle() {
    // eslint-disable-next-line no-console
    console.debug('[music] mute button clicked');
    if (typeof window !== 'undefined' && typeof window.__invMusicControls?.toggleMute === 'function') {
      try {
        // eslint-disable-next-line no-console
        console.debug('[music] using window.__invMusicControls.toggleMute');
        await window.__invMusicControls.toggleMute();
        return;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.debug('[music] global toggleMute failed, fallback to local', error);
      }
    }
    const audio = audioRef.current;
    if (!audio) return;
    // eslint-disable-next-line no-console
    console.debug('[music] using local fallback toggle');
    const nextMuted = !audio.muted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);
  }

  if (!data?.audioSrc) return null;

  return (
    <div className={styles.musicDock}>
      <audio ref={audioRef} preload="metadata" loop autoPlay={Boolean(data?.autoplay)} playsInline src={data.audioSrc} />
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
