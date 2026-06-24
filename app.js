const themes = { matrix: ThemeMatrix, clock: ThemeClock, 'time-elapsing': ThemeTimeElapsing, 'flip-clock': ThemeFlipClock };

const menu = document.getElementById('menu');
const saver = document.getElementById('screen-saver');
const canvas = document.getElementById('canvas');
let currentCleanup = null;

document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.theme;
    const theme = themes[name];
    if (!theme) return;

    if (currentCleanup) {
      currentCleanup();
      currentCleanup = null;
    }

    menu.style.display = 'none';
    saver.style.display = 'block';

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    currentCleanup = theme.start(canvas);

    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }

    saver.style.cursor = 'none';
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    exitScreensaver();
  }
});

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    exitScreensaver();
  }
});

document.addEventListener('webkitfullscreenchange', () => {
  if (!document.webkitFullscreenElement) {
    exitScreensaver();
  }
});

document.addEventListener('msfullscreenchange', () => {
  if (!document.msFullscreenElement) {
    exitScreensaver();
  }
});

function exitScreensaver() {
  saver.style.cursor = '';
  saver.style.display = 'none';
  menu.style.display = 'flex';

  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }

  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  } else if (document.webkitFullscreenElement) {
    document.webkitExitFullscreen();
  } else if (document.msFullscreenElement) {
    document.msExitFullscreen();
  }
}
