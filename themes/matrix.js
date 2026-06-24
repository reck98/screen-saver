const ThemeMatrix = {
  name: 'matrix',
  animId: null,

  start(canvas) {
    const ctx = canvas.getContext('2d');
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let cols, drops, fontSize;

    function resize() {
      fontSize = Math.max(12, Math.floor(canvas.width / 80));
      cols = Math.floor(canvas.width / fontSize);
      drops = Array(cols).fill(1);
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0f0';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      ThemeMatrix.animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(ThemeMatrix.animId);
      window.removeEventListener('resize', resize);
    };
  }
};
