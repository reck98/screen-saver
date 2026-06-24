const ThemeClock = {
  name: 'clock',
  animId: null,

  start(canvas) {
    const ctx = canvas.getContext('2d');
    let blink = true;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const timeStr = h + ':' + m + ':' + s;

      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const size = Math.min(canvas.width, canvas.height) * 0.13;
      const gap = size * 0.12;

      ctx.shadowColor = '#00ff41';
      ctx.shadowBlur = 30;
      ctx.font = `200 ${size}px 'Courier New', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#00ff41';
      ctx.fillText(timeStr, cx, cy - gap);
      ctx.shadowBlur = 0;

      const colonActive = s % 2 === 0;
      if (!colonActive) {
        ctx.fillStyle = '#0a0a0a';
        ctx.font = `200 ${size}px 'Courier New', monospace`;
        ctx.fillText(':', cx - size * 0.55, cy - gap);
        ctx.fillText(':', cx + size * 0.55, cy - gap);
      }

      ctx.font = `${size * 0.1}px 'Courier New', monospace`;
      ctx.fillStyle = '#00ff41';
      ctx.textAlign = 'center';
      ctx.fillText('> ' + now.toISOString().slice(0, 10) + ' <', cx, cy + gap * 2.2);

      ctx.font = `${size * 0.08}px 'Courier New', monospace`;
      ctx.fillStyle = '#00ff41';

      const unix = Math.floor(now.getTime() / 1000);
      const hexH = now.getHours().toString(16).padStart(2, '0');
      const hexM = now.getMinutes().toString(16).padStart(2, '0');
      const hexS = now.getSeconds().toString(16).padStart(2, '0');
      const hexTime = hexH + ':' + hexM + ':' + hexS;

      const sBin = now.getSeconds().toString(2).padStart(6, '0');

      ctx.textAlign = 'left';
      ctx.fillText('$ unix: ' + unix, cx - size * 1.8, cy + gap * 4);
      ctx.fillText('$ hex:  0x' + hexTime.toUpperCase(), cx - size * 1.8, cy + gap * 5);
      ctx.fillText('$ bin:  ' + sBin, cx - size * 1.8, cy + gap * 6);

      ctx.textAlign = 'right';
      ctx.font = `${size * 0.06}px 'Courier New', monospace`;
      ctx.fillStyle = 'rgba(0, 255, 65, 0.5)';
      ctx.fillText('v1.0.0 | press ESC to exit', cx + size * 1.8, cy + gap * 7);

      ctx.textAlign = 'left';
      ctx.font = `${size * 0.07}px 'Courier New', monospace`;
      ctx.fillStyle = '#00ff41';
      const bars = Math.floor((now.getSeconds() / 60) * 40);
      const progress = '[' + '\u2588'.repeat(bars) + '\u2591'.repeat(40 - bars) + ']';
      ctx.fillText(progress, cx - size * 1.8, cy + gap * 3);

      blink = !blink;

      ThemeClock.animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(ThemeClock.animId);
      window.removeEventListener('resize', resize);
    };
  }
};
