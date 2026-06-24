const ThemeTimeElapsing = {
  name: 'time-elapsing',
  animId: null,

  start(canvas) {
    const ctx = canvas.getContext('2d');
    let startTime = Date.now();

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    function formatElapsed(ms) {
      const totalSec = Math.floor(ms / 1000);
      const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
      const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
      const s = String(totalSec % 60).padStart(2, '0');
      const millis = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
      return `${h}:${m}:${s}.${millis}`;
    }

    function draw() {
      const elapsed = Date.now() - startTime;
      const text = formatElapsed(elapsed);

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const size = Math.min(canvas.width, canvas.height) * 0.1;
      ctx.font = `${size}px 'Courier New', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const x = canvas.width / 2;
      const y = canvas.height / 2;

      ctx.fillStyle = '#0ff';
      ctx.shadowColor = '#0ff';
      ctx.shadowBlur = 20;
      ctx.fillText(text, x, y);
      ctx.shadowBlur = 0;

      ctx.font = `${size * 0.18}px 'Segoe UI', system-ui, sans-serif`;
      ctx.fillStyle = 'rgba(0, 255, 255, 0.4)';
      ctx.fillText('TIME ELAPSING', x, y - size * 1.5);

      ctx.fillStyle = 'rgba(0, 255, 255, 0.15)';
      ctx.font = `${size * 0.1}px 'Courier New', monospace`;
      ctx.fillText('since session start', x, y + size * 0.8);

      for (let i = 0; i < 40; i++) {
        const px = Math.random() * canvas.width;
        const py = Math.random() * canvas.height;
        const pr = Math.random() * 1.5;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 255, ${Math.random() * 0.3})`;
        ctx.fill();
      }

      ThemeTimeElapsing.animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(ThemeTimeElapsing.animId);
      window.removeEventListener('resize', resize);
    };
  }
};
