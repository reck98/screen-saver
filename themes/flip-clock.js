const ThemeFlipClock = {
  name: 'flip-clock',
  animId: null,
  root: null,

  start(canvas) {
    const saver = document.getElementById('screen-saver');
    const root = document.createElement('div');
    root.className = 'flip-clock-root';
    this.root = root;

    root.innerHTML = `
      <div class="fc-info">
        <span class="fc-day" id="fc-day"></span>
        <span class="fc-sep">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
        <span class="fc-date" id="fc-date"></span>
        <span class="fc-sep">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
        <span class="fc-month" id="fc-month"></span>
      </div>
      <div class="fc-digits">
        <div class="fc-group" id="fc-group-h">
          <div class="fc-digit" data-val="">
            <div class="fc-face fc-top"></div>
            <div class="fc-face fc-bot"></div>
          </div>
          <div class="fc-digit" data-val="">
            <div class="fc-face fc-top"></div>
            <div class="fc-face fc-bot"></div>
          </div>
        </div>
        <div class="fc-colon">
          <div class="fc-colon-dot"></div>
          <div class="fc-colon-dot"></div>
        </div>
        <div class="fc-group" id="fc-group-m">
          <div class="fc-digit" data-val="">
            <div class="fc-face fc-top"></div>
            <div class="fc-face fc-bot"></div>
          </div>
          <div class="fc-digit" data-val="">
            <div class="fc-face fc-top"></div>
            <div class="fc-face fc-bot"></div>
          </div>
        </div>
        <div class="fc-colon">
          <div class="fc-colon-dot"></div>
          <div class="fc-colon-dot"></div>
        </div>
        <div class="fc-group" id="fc-group-s">
          <div class="fc-digit" data-val="">
            <div class="fc-face fc-top"></div>
            <div class="fc-face fc-bot"></div>
          </div>
          <div class="fc-digit" data-val="">
            <div class="fc-face fc-top"></div>
            <div class="fc-face fc-bot"></div>
          </div>
        </div>
      </div>
    `;

    saver.appendChild(root);

    const hourDigits = document.getElementById('fc-group-h').children;
    const minDigits  = document.getElementById('fc-group-m').children;
    const secDigits  = document.getElementById('fc-group-s').children;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const init = new Date();
    const initHH = String(init.getHours()).padStart(2, '0');
    const initMM = String(init.getMinutes()).padStart(2, '0');
    const initSS = String(init.getSeconds()).padStart(2, '0');
    this.setDigit(hourDigits[0], initHH[0]);
    this.setDigit(hourDigits[1], initHH[1]);
    this.setDigit(minDigits[0], initMM[0]);
    this.setDigit(minDigits[1], initMM[1]);
    this.setDigit(secDigits[0], initSS[0]);
    this.setDigit(secDigits[1], initSS[1]);

    document.getElementById('fc-day').textContent = days[init.getDay()];
    document.getElementById('fc-date').textContent = init.getDate();
    document.getElementById('fc-month').textContent = months[init.getMonth()];

    let lastHH = init.getHours();
    let lastMM = init.getMinutes();
    let lastSS = init.getSeconds();
    let colonOn = true;

    const update = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const s = now.getSeconds();

      if (h !== lastHH) {
        const hh = String(h).padStart(2, '0');
        this.flipTo(hourDigits[0], hh[0]);
        this.flipTo(hourDigits[1], hh[1]);
        lastHH = h;
      }

      if (m !== lastMM) {
        const mm = String(m).padStart(2, '0');
        this.flipTo(minDigits[0], mm[0]);
        this.flipTo(minDigits[1], mm[1]);
        lastMM = m;
        document.getElementById('fc-day').textContent = days[now.getDay()];
        document.getElementById('fc-date').textContent = now.getDate();
        document.getElementById('fc-month').textContent = months[now.getMonth()];
      }

      if (s !== lastSS) {
        const ss = String(s).padStart(2, '0');
        this.flipTo(secDigits[0], ss[0]);
        this.flipTo(secDigits[1], ss[1]);
        lastSS = s;
      }

      colonOn = s % 2 === 0;
      root.querySelectorAll('.fc-colon-dot').forEach(d => {
        d.style.opacity = colonOn ? '1' : '0.12';
      });

      this.animId = requestAnimationFrame(update);
    };

    this.animId = requestAnimationFrame(update);

    return () => {
      if (this.animId) cancelAnimationFrame(this.animId);
      if (this.root && this.root.parentNode) {
        this.root.parentNode.removeChild(this.root);
      }
      this.root = null;
    };
  },

  setDigit(digitEl, val) {
    if (!digitEl) return;
    const top = digitEl.querySelector('.fc-top');
    const bot = digitEl.querySelector('.fc-bot');
    if (top) top.textContent = val;
    if (bot) bot.textContent = val;
    digitEl.dataset.val = val;
  },

  flipTo(digitEl, newVal) {
    if (!digitEl) return;
    const oldVal = digitEl.dataset.val;
    if (oldVal === newVal) return;

    const top = digitEl.querySelector('.fc-top');
    const bot = digitEl.querySelector('.fc-bot');

    const flap = document.createElement('div');
    flap.className = 'fc-flap';
    flap.innerHTML = `
      <div class="fc-flap-front">${oldVal}</div>
      <div class="fc-flap-back">${newVal}</div>
    `;
    digitEl.appendChild(flap);

    requestAnimationFrame(() => {
      flap.classList.add('fc-flap-go');
    });

    setTimeout(() => {
      if (top) top.textContent = newVal;
      if (bot) bot.textContent = newVal;
      digitEl.dataset.val = newVal;
      if (flap.parentNode) flap.remove();
    }, 500);
  }
};
