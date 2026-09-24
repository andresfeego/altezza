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

export default function MusicPlayerView({ data, styles, playbackReady = true, waitForStart = false }) {
  const audioRef = useRef(null);
  const buttonRef = useRef(null);
  const controlsRef = useRef(null);
  const [audible, setAudible] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !playbackReady) return undefined;
    let disposed = false;
    let userMuted = false;
    const interactionEvents = ['pointerup', 'touchend', 'click', 'keydown'];
    const sync = () => { if (!disposed) setAudible(!audio.paused && !audio.muted); };
    const stopWaitingForGesture = () => interactionEvents.forEach(name => window.removeEventListener(name, firstInteraction));

    audio.loop = true;
    audio.muted = Boolean(data?.initiallyMuted);
    sync();

    async function resume() {
      try {
        await audio.play();
        if (disposed) return;
        stopWaitingForGesture();
      } catch (_error) {
        // Keep the gesture listeners: an autoplay rejection is not a media failure.
        // Do not pause here; an earlier rejected attempt must not stop a later gesture.
      }
      sync();
    }
    function firstInteraction(event) {
      // The sound button handles its own click; a bubbling gesture must not toggle twice.
      if (userMuted || (event.target?.nodeType && buttonRef.current?.contains(event.target))) return;
      if (!audio.paused) { sync(); stopWaitingForGesture(); return; }
      resume();
    }
    function playUnmute() {
      // Opening an envelope must not override a mute chosen during its introduction.
      if (userMuted) return;
      audio.muted = false;
      return resume();
    }
    function mute() {
      userMuted = true;
      audio.muted = true;
      stopWaitingForGesture();
      sync();
    }
    function unmute() {
      userMuted = false;
      audio.muted = false;
      sync();
    }
    function toggleMute() {
      if (audio.paused || audio.muted) {
        unmute();
        return resume();
      }
      mute();
    }
    const controls = { playUnmute, mute, unmute, toggleMute };
    controlsRef.current = controls;
    window.__invMusicControls = controls;
    ['volumechange', 'play', 'pause', 'error'].forEach(name => audio.addEventListener(name, sync));
    window.addEventListener('envelopIntro:open', playUnmute);
    if (!waitForStart) {
      interactionEvents.forEach(name => window.addEventListener(name, firstInteraction, { passive: true }));
      if (data?.autoplay) resume();
    }

    return () => {
      disposed = true;
      stopWaitingForGesture();
      ['volumechange', 'play', 'pause', 'error'].forEach(name => audio.removeEventListener(name, sync));
      window.removeEventListener('envelopIntro:open', playUnmute);
      if (window.__invMusicControls === controls) delete window.__invMusicControls;
      if (controlsRef.current === controls) controlsRef.current = null;
      audio.pause();
    };
  }, [data?.audioSrc, data?.autoplay, data?.initiallyMuted, playbackReady, waitForStart]);

  if (!data?.audioSrc) return null;
  const label = audible ? 'Silenciar sonido' : 'Activar sonido';
  return (
    <div className={styles.musicDock} data-invitation-music>
      <audio ref={audioRef} preload="auto" loop playsInline src={data.audioSrc} />
      <button ref={buttonRef} type="button" className={styles.musicToggleButton}
        onClick={() => controlsRef.current?.toggleMute()} disabled={!playbackReady}
        aria-label={label} title={label}>
        {audible ? <SoundOnIcon /> : <SoundOffIcon />}
      </button>
    </div>
  );
}
