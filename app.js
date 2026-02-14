// Placeholder for future interactions
console.log("Pop-up Lena site loaded");
// ===== Random scrolling doodles with emoji endpoints =====
(() => {
  const COLORS = ["y", "r", "b"];

  // Allowed categories only:
  const EMOJI = [
    // animals
    "🐶","🐱","🐰","🦊","🐻","🐼","🐯","🦁","🐸","🐵","🐤","🦉","🐢","🐟","🐙","🦋",
    // buildings / places (no flags)
    "🏠","🏡","🏫","🏢","🏬","🏛️","🏰","🗼","⛺",
    // plants
    "🌿","🍀","🌵","🌲","🌳","🌴","🪴","🌷","🌻","🌼",
    // food
    "🍎","🍌","🍇","🍓","🍒","🥕","🥨","🧀","🍞","🍪","🍩",
    // sports (no gestures)
    "⚽","🏀","🏈","🎾","🏐","🏓","⛳","🥊","🛹",
    // creativity
    "✏️","🖍️","🎨","🧵","🧶","✂️","📎","📏"
  ];

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Build a smooth curvy path between two points
  function makePath(x1,y1,x2,y2){
    const dx = x2 - x1;
    const dy = y2 - y1;
    const mx = (x1 + x2)/2;
    const my = (y1 + y2)/2;

    // control points - add random curvature
    const c1x = x1 + dx * 0.35 + rand(-120, 120);
    const c1y = y1 + dy * 0.10 + rand(-140, 140);
    const c2x = x2 - dx * 0.35 + rand(-120, 120);
    const c2y = y2 - dy * 0.10 + rand(-140, 140);

    // extra "wiggle" via quadratic mid bump (optional)
    const bumpx = mx + rand(-160,160);
    const bumpy = my + rand(-160,160);

    return `M ${x1} ${y1}
            C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
  }

  function createEmoji(svg, x, y, emoji){
    const t = document.createElementNS("http://www.w3.org/2000/svg","text");
    t.setAttribute("x", x);
    t.setAttribute("y", y);
    t.setAttribute("text-anchor","middle");
    t.setAttribute("dominant-baseline","middle");
    t.setAttribute("class","doodle-emoji");
    t.textContent = emoji;
    svg.appendChild(t);
  }

  function createPath(svg, x1,y1,x2,y2){
    const p = document.createElementNS("http://www.w3.org/2000/svg","path");
    const color = pick(COLORS);
    p.setAttribute("d", makePath(x1,y1,x2,y2));
    p.setAttribute("class", `dl dl--${color} ${Math.random() > 0.6 ? "dl--wiggle":""}`);
    svg.appendChild(p);
  }

  function buildDoodles(){
    const host = document.getElementById("doodles");
    if(!host) return;

    // Clear previous
    host.innerHTML = "";

    // Get document size
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.scrollHeight;

    const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("preserveAspectRatio","none");
    host.appendChild(svg);

    // Anchor points: near each section (so lines feel "connected" to blocks)
    const sections = Array.from(document.querySelectorAll(".section"));
    const points = sections.map(sec => {
      const r = sec.getBoundingClientRect();
      const top = r.top + window.scrollY;

      // choose left or right side randomly
      const side = Math.random() > 0.5 ? 0.25 : 0.75;
      const x = w * side + rand(-80, 80);
      const y = top + r.height * rand(0.25, 0.75);

      return {x, y};
    });

    // Add a few extra random points in margins to make it playful
    const extra = Math.max(6, Math.floor(h / 900));
    for(let i=0;i<extra;i++){
      points.push({
        x: rand(80, w-80),
        y: rand(120, h-120)
      });
    }

    // How many connections
    const lines = Math.min(16, Math.max(8, Math.floor(h / 520)));

    for(let i=0;i<lines;i++){
      const a = pick(points);
      let b = pick(points);
      // avoid too close
      let tries = 0;
      while(Math.hypot(a.x-b.x, a.y-b.y) < 260 && tries < 10){
        b = pick(points); tries++;
      }

      createPath(svg, a.x,a.y,b.x,b.y);

      // Place emojis near endpoints (slight offset)
      const e1 = pick(EMOJI);
      const e2 = pick(EMOJI);
      createEmoji(svg, a.x + rand(-18,18), a.y + rand(-18,18), e1);
      createEmoji(svg, b.x + rand(-18,18), b.y + rand(-18,18), e2);
    }
  }

  // Build once on load, and rebuild on resize (debounced)
  let t = null;
  window.addEventListener("load", buildDoodles);
  window.addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(buildDoodles, 150);
  });
})();
