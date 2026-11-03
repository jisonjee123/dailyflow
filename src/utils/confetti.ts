import confetti from 'canvas-confetti';

export function fireTaskCelebration() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.8 },
    colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'],
    disableForReducedMotion: true,
  });
}

export function fireStreakCelebration() {
  const end = Date.now() + 1000;
  const colors = ['#ff5722', '#ff9100', '#ffd600', '#22c55e'];

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

