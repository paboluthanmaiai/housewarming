/**
 * SHAIK KABEER — HOUSE-WARMING DIGITAL INVITATION
 * Elegant, mobile-first client interactions
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. SCROLL REVEALS & HEADER DYNAMICS
  // =========================================================================
  const siteHeader = document.getElementById('siteHeader');
  const revealElements = document.querySelectorAll('.reveal');

  // Header scroll state
  const handleScroll = () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Intersection Observer for graceful fade-ins
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // Gentle Parallax for Hero
  const heroImg = document.getElementById('heroImg');
  if (heroImg) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < window.innerHeight) {
            heroImg.style.transform = `scale(1.02) translateY(${scrollY * 0.18}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // =========================================================================
  // 2. TOAST NOTIFICATION UTILITY
  // =========================================================================
  const toastNotice = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMsg');
  let toastTimeout;

  const showToast = (message) => {
    if (!toastNotice) return;
    toastMsg.textContent = message;
    toastNotice.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3200);
  };

  // =========================================================================
  // 3. COPY ADDRESS TO CLIPBOARD
  // =========================================================================
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  const fullAddressText = 'Shaik Kabeer, G875+7HQ, Phase 2, NSL Colony, Ramachandrapuram, Hyderabad, Telangana 502032';

  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(fullAddressText);
        showToast('Address copied to clipboard!');
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = fullAddressText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Address copied to clipboard!');
      }
    });
  }

  // =========================================================================
  // 4. ADD TO CALENDAR (.ICS & GOOGLE CALENDAR)
  // =========================================================================
  const calendarBtn = document.getElementById('calendarBtn');
  const heroCalendarBtn = document.getElementById('heroCalendarBtn');
  const stickyCalendarBtn = document.getElementById('stickyCalendarBtn');
  
  const handleCalendarAction = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      // Direct Google Calendar Web Link
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Shaik Kabeer — House-Warming Lunch')}&dates=20261011T073000Z/20261011T103000Z&details=${encodeURIComponent('Join Shaik Kabeer to celebrate the beginning of their new home over lunch.')}&location=${encodeURIComponent('G875+7HQ, Phase 2, NSL Colony, Ramachandrapuram, Hyderabad, Telangana 502032')}`;
      window.open(gcalUrl, '_blank');
    } else {
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Shaik Kabeer//House Warming Invitation//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:housewarming-shaik-kabeer-20261011@invitation',
        'DTSTAMP:20261008T120000Z',
        'DTSTART:20261011T073000Z', // 1:00 PM IST is 07:30 UTC
        'DTEND:20261011T103000Z',   // 4:00 PM IST is 10:30 UTC
        'SUMMARY:Shaik Kabeer — House-Warming Lunch',
        'DESCRIPTION:Join Shaik Kabeer as they open the doors to their new home and celebrate over lunch.',
        'LOCATION:G875+7HQ\\, Phase 2\\, NSL Colony\\, Ramachandrapuram\\, Hyderabad\\, Telangana 502032',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Shaik_Kabeer_House_Warming.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Event added to calendar (.ics downloaded)');
    }
  };

  if (calendarBtn) calendarBtn.addEventListener('click', handleCalendarAction);
  if (heroCalendarBtn) heroCalendarBtn.addEventListener('click', handleCalendarAction);
  if (stickyCalendarBtn) stickyCalendarBtn.addEventListener('click', handleCalendarAction);

  // =========================================================================
  // 5. SHARE INVITATION LINK
  // =========================================================================
  const headerShareBtn = document.getElementById('headerShareBtn');
  if (headerShareBtn) {
    headerShareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Shaik Kabeer — House-Warming Invitation',
        text: 'Join Shaik Kabeer as they open the doors to their new home on Sunday, 11 October 2026. Lunch at 1:00 PM.',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          // User dismissed share
        }
      } else {
        try {
          await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
          showToast('Invitation link copied to clipboard!');
        } catch (err) {
          showToast('Invitation link ready to share');
        }
      }
    });
  }

  // =========================================================================
  // 6. BACKGROUND AUDIO CONTROLLER
  // Supports custom MP3 file (assets/song/background-music.mp3)
  // With graceful fallback to Web Audio API ambient synthesis
  // =========================================================================
  const audioToggle = document.getElementById('audioToggle');
  const audioLabel = document.getElementById('audioLabel');
  const bgAudio = document.getElementById('bgAudio');
  let isPlaying = false;
  let audioCtx = null;
  let ambientNodes = [];

  const startAmbientSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      if (!audioCtx) {
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.09, audioCtx.currentTime + 3.0);
      masterGain.connect(audioCtx.destination);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(480, audioCtx.currentTime);
      filter.connect(masterGain);

      const chordFrequencies = [
        { freq: 155.56, type: 'sine', detune: 0, gain: 0.28 },
        { freq: 155.56, type: 'triangle', detune: 3, gain: 0.15 },
        { freq: 233.08, type: 'sine', detune: -2, gain: 0.22 },
        { freq: 311.13, type: 'sine', detune: 4, gain: 0.12 },
        { freq: 466.16, type: 'sine', detune: -1, gain: 0.05 }
      ];

      chordFrequencies.forEach(voice => {
        const osc = audioCtx.createOscillator();
        const voiceGain = audioCtx.createGain();
        osc.type = voice.type;
        osc.frequency.setValueAtTime(voice.freq, audioCtx.currentTime);
        osc.detune.setValueAtTime(voice.detune, audioCtx.currentTime);

        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();
        lfo.frequency.setValueAtTime(0.12 + Math.random() * 0.08, audioCtx.currentTime);
        lfoGain.gain.setValueAtTime(voice.gain * 0.35, audioCtx.currentTime);
        lfo.connect(lfoGain.gain);

        voiceGain.gain.setValueAtTime(voice.gain, audioCtx.currentTime);
        osc.connect(voiceGain);
        voiceGain.connect(filter);
        osc.start();
        lfo.start();
        ambientNodes.push({ osc, lfo, voiceGain });
      });

      ambientNodes.push({ masterGain });
      isPlaying = true;
      audioToggle.classList.add('playing');
      //audioLabel.textContent = 'Music: On';
      showToast('Background music playing');
    } catch (e) {
      console.warn('Synthesizer audio blocked:', e);
    }
  };

  const stopAmbientSound = () => {
    if (audioCtx) {
      try {
        const masterNode = ambientNodes.find(n => n.masterGain);
        if (masterNode) {
          masterNode.masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
          setTimeout(() => {
            ambientNodes.forEach(n => {
              if (n.osc) {
                try { n.osc.stop(); n.lfo.stop(); } catch (e) {}
              }
            });
            ambientNodes = [];
            if (audioCtx && audioCtx.state !== 'closed') {
              audioCtx.suspend();
            }
          }, 1300);
        }
      } catch (e) {
        ambientNodes = [];
      }
    }
  };

  const playMusic = async () => {
    if (bgAudio) {
      try {
        await bgAudio.play();
        isPlaying = true;
        audioToggle.classList.add('playing');
        //audioLabel.textContent = 'Music: On';
        showToast('Background music playing');
        return;
      } catch (err) {
        console.warn('HTML Audio play error, falling back to ambient synthesis:', err);
      }
    }
    startAmbientSound();
  };

  const pauseMusic = () => {
    if (bgAudio && !bgAudio.paused) {
      bgAudio.pause();
    }
    stopAmbientSound();
    isPlaying = false;
    audioToggle.classList.remove('playing');
    audioLabel.textContent = 'Music: Off';
  };

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      if (!isPlaying) {
        playMusic();
      } else {
        pauseMusic();
      }
    });
  }

});
