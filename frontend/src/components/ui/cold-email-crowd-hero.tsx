"use client";

/* Signal-led outbound hero: a crowd walks past, a buying signal pops over one
   person, an AI first line is typed, an email flies along an arc, and the reply
   comes back. Port of the Reachable hero (Open Peeps crowd + canvas beams). */
import { useEffect, useRef } from "react";
import { animate, stagger } from "motion";

/* Open Peeps (CC0) crowd + logo, served from a public bucket */
const ASSET = (id: string) => `https://wbarljqnwyapytycfglm.supabase.co/storage/v1/object/public/canvas_assets/c5b084d7-d978-4942-8775-19c92226e9c1/${id}.svg`;
const LOGO = ASSET("7be04170-e14f-416c-860b-0a96c13fb164");
const MARK = ASSET("409b2de1-6b00-4a67-bb3c-1c822ec6ce82");
const PEEPS = ["381d6479-f5b5-49ca-82f3-474c87c62996", "9df39fca-20db-4273-bf7e-488d04a13321", "3c8ee64a-67b3-4a2c-84d5-c665c725e7c5", "3ccafa92-f479-4885-a6fb-0af92993b7f6", "735686b6-9bd5-4ab1-9fe6-59c50b5e2eb0", "3f775475-8920-4f55-b7c1-16bf192a0b1f", "b56ceaf5-7fb3-40a2-bb1a-d41c547c71ca", "4bd0452d-b321-4488-b57a-0c52dc73ceb1", "5d3553c5-a46f-4238-bcb5-02ff60b0f907", "6669baf9-e6d8-476b-abd4-e3d52517aee8", "2a2fffcb-9e4e-4610-a2ec-c2c334e29001", "742a5c0b-c77f-4ab3-96eb-dbca387f5ff8", "da0b3073-d6fd-46d2-a1f6-747fbfedf2b1", "d9738cd5-9685-47c4-9eab-e004c4d83776", "706557e0-8408-4b07-bcab-2968cf4c493e", "45a054f3-181d-4746-983d-12be5078e2f0", "38ab3806-883c-4868-9198-a1db96941d06", "6a165ed6-e6e5-4695-9aff-bd2cd51c4b1e", "c5d7e55b-3899-4297-8632-a5f6a186ac05", "25b3470e-e046-42f5-9b36-591d37e72d28"].map(ASSET);

export type Reach = { tag: string; tc: "caution" | "route" | "plain"; signal: string; lab: string; line: string; rtag: string; rc: "caution" | "route" | "plain"; reply: string };

const DEFAULT_DATA: Reach[] = [
  { tag: "Hiring", tc: "caution", signal: "Linear is hiring 4 Account Executives", lab: "AI · First line", line: "Saw you’re adding four AEs this quarter —", rtag: "Interested", rc: "route", reply: "Timing is good — can you do Thursday at 2pm?" },
  { tag: "Visitor", tc: "route", signal: "Someone from Ramp viewed /pricing 3×", lab: "AI · First line", line: "Noticed the team has been comparing plans —", rtag: "Question", rc: "plain", reply: "What does pricing look like for 3 seats?" },
  { tag: "Funding", tc: "caution", signal: "Attio raised a $52M Series B", lab: "AI · Why now", line: "Fresh Series B, first SDRs", rtag: "Referral", rc: "caution", reply: "Please reach out to our Head of Growth" },
  { tag: "Hiring", tc: "caution", signal: "Figma is hiring 24 Account Executives", lab: "Step 1 · Email", line: "Figma’s new AEs", rtag: "Interested", rc: "route", reply: "Can we do a demo next Tuesday?" },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400..600;1,8..60,400..600&display=swap');
.rch{--base:#f5f9f4;--c1:#b5d98c;--c2:#8cc5a6;--c3:#c6e4f1;--c4:#eef5e2;--ac:46,125,91;--route2:#256b4c;--tint:#e6f1eb;--rline:#cfe4d8;--route:rgb(var(--ac));--panel:#fff;--ink:#37352f;--ink2:#504e49;--muted:#6b6a65}
.rch,.rch *{box-sizing:border-box}
.rch{position:relative;width:100%;height:100vh;min-height:900px;overflow:hidden;background:var(--base);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.rch a{color:inherit;text-decoration:none}
.rch .bg{position:absolute;inset:0;overflow:hidden;background:var(--base)}
.rch .bg i{position:absolute;border-radius:50%;filter:blur(80px);opacity:.18;will-change:transform}
.rch .b1{left:-14%;top:48%;width:58%;height:84%;background:var(--c1);animation:rch-d1 24s ease-in-out infinite alternate}
.rch .b2{left:24%;top:58%;width:54%;height:76%;background:var(--c2);animation:rch-d2 28s ease-in-out infinite alternate}
.rch .b3{right:-16%;top:42%;width:56%;height:88%;background:var(--c3);animation:rch-d3 26s ease-in-out infinite alternate}
.rch .b4{left:52%;top:52%;width:26%;height:36%;background:var(--c4);animation:rch-d2 20s ease-in-out infinite alternate-reverse}
.rch .dome{position:absolute;left:-28%;right:-28%;top:-52%;height:112%;border-radius:50%;background:radial-gradient(closest-side,#fff 64%,rgba(255,255,255,.86) 78%,rgba(255,255,255,0) 100%)}
.rch .grain{position:absolute;inset:0;width:100%;height:100%;opacity:.06}
@keyframes rch-d1{to{transform:translate(9%,-7%) scale(1.08)}}
@keyframes rch-d2{to{transform:translate(-8%,-5%) scale(1.1)}}
@keyframes rch-d3{to{transform:translate(-7%,6%) scale(1.06)}}
.rch .fx{position:absolute;z-index:3;left:0;top:0;width:100%;height:100%;pointer-events:none}
.rch .nav{position:absolute;z-index:10;top:0;left:0;right:0;height:72px}
.rch .nav .in{max-width:1240px;height:100%;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between}
.rch .brand{display:inline-flex;align-items:center;gap:8px;font-size:21px;font-weight:700;letter-spacing:-.02em}
.rch .brand img{width:25px;height:28px;display:block}
.rch .links{display:flex;gap:34px;font-size:14.5px;color:var(--ink2)}
.rch .links a{opacity:.8;transition:opacity .2s}
.rch .links a:hover{opacity:1}
.rch .acts{display:flex;align-items:center;gap:6px}
.rch .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:40px;padding:0 16px;border-radius:10px;border:1px solid rgba(55,53,47,.1);background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:var(--ink);font-size:14.5px;font-weight:500;transition:background .2s,transform .35s cubic-bezier(.3,1.6,.5,1),box-shadow .3s}
.rch .btn:hover{background:#fff}
.rch .btn.ghost{border-color:transparent;background:transparent;-webkit-backdrop-filter:none;backdrop-filter:none}
.rch .btn.pri{border-color:transparent;background:var(--route);color:#fff;box-shadow:inset 0 1px 0 rgba(255,255,255,.28),0 10px 24px -10px rgba(var(--ac),.75)}
.rch .btn.pri:hover{background:var(--route2);transform:translateY(-1px);box-shadow:inset 0 1px 0 rgba(255,255,255,.28),0 16px 30px -10px rgba(var(--ac),.8)}
.rch .hero{position:absolute;z-index:6;left:0;right:0;top:92px;text-align:center}
.rch .kick{display:inline-flex;align-items:center;gap:10px;font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--ink2)}
.rch .kick i{width:6px;height:6px;border-radius:50%;background:var(--route);box-shadow:0 0 0 4px rgba(var(--ac),.16)}
.rch h1{margin:18px 0 0;font-family:"Source Serif 4",ui-serif,Georgia,serif;font-size:88px;line-height:1.05;letter-spacing:-2.6px;font-weight:400}
.rch h1 .w{display:inline-block}
.rch h1 em{font-style:italic;color:var(--route)}
.rch .ph{position:relative;white-space:nowrap}
.rch .ph::after{content:"";position:absolute;z-index:-1;left:-.04em;right:-.04em;bottom:.09em;height:.3em;border-radius:.08em;background:var(--rline);transform:scaleX(0);transform-origin:0 50%;opacity:0}
.rch .ph.hit::after{animation:rch-mark 1.8s cubic-bezier(.5,0,.2,1)}
.rch .ph.lit::after{transform:none;opacity:1}
@keyframes rch-mark{0%{transform:scaleX(0);opacity:1}28%{transform:scaleX(1);opacity:1}76%{transform:scaleX(1);opacity:1}100%{transform:scaleX(1);opacity:0}}
.rch .lead{max-width:900px;margin:22px auto 0;font-size:18px;line-height:1.6;color:var(--muted)}
.rch .ctas{display:flex;justify-content:center;gap:10px;margin-top:26px}
.rch .ctas .btn{height:48px;padding:0 22px;border-radius:12px;font-size:15.5px;font-weight:600}
.rch .beacon{position:absolute;z-index:5;left:50%;top:414px;width:60px;height:60px;margin-left:-30px}
.rch .btile{width:100%;height:100%;border-radius:18px;background:var(--route);display:grid;place-items:center;box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 0 0 6px rgba(255,255,255,.6),0 0 0 7px rgba(var(--ac),.16),0 18px 34px -12px rgba(var(--ac),.75)}
.rch .btile img{width:27px;height:31px;display:block}
.rch .compose{position:absolute;z-index:5;left:50%;top:488px;pointer-events:none}
.rch .cen{position:absolute;left:0;top:0;transform:translateX(-50%);width:max-content}
.rch .cbox{display:flex;align-items:center;gap:8px;height:30px;padding:0 13px 0 5px;border-radius:999px;background:rgba(255,255,255,.92);border:1px solid rgba(55,53,47,.08);box-shadow:0 14px 30px -14px rgba(30,40,35,.4);font-size:13px;white-space:nowrap;transform:scale(0);transform-origin:50% 0}
.rch .cbox .lab{height:20px;padding:0 8px;border-radius:999px;background:var(--tint);color:var(--route2);font:500 11px/20px "JetBrains Mono",ui-monospace,monospace}
.rch .caret{width:1.5px;height:14px;margin-left:-6px;background:var(--route);animation:rch-blink 1s steps(1) infinite}
@keyframes rch-blink{50%{opacity:0}}
.rch .crowd{position:absolute;z-index:2;left:0;right:0;top:540px;height:360px;pointer-events:none}
.rch .pw{position:absolute;left:0}
.rch .pe{width:100%;height:100%;will-change:transform;transform-origin:50% 88%}
.rch .hp{position:relative;width:100%;height:100%}
.rch .pw img{display:block;width:100%;height:100%;transition:filter .45s,transform .5s cubic-bezier(.3,1.6,.5,1)}
.rch .ok{position:absolute;left:64%;top:8%;width:24px;height:24px;border-radius:50%;background:var(--route);box-shadow:0 0 0 2.5px #fff,0 6px 12px -4px rgba(var(--ac),.6);display:grid;place-items:center;transform:scale(0);transition:transform .45s cubic-bezier(.3,1.7,.5,1)}
.rch .ok svg{width:13px;height:13px}
.rch .pw.done .ok{transform:scale(1)}
.rch .tip{position:absolute;z-index:4;left:0;top:0;pointer-events:none;will-change:transform}
.rch .tip .cen{top:auto;bottom:0}
.rch .tbox{position:relative;display:flex;align-items:center;gap:8px;height:36px;padding:0 13px 0 7px;border-radius:12px;background:var(--panel);border:1px solid rgba(55,53,47,.08);box-shadow:0 18px 40px -16px rgba(30,40,35,.42),0 2px 6px -2px rgba(30,40,35,.12);font-size:13px;font-weight:600;white-space:nowrap;transform:scale(0);transform-origin:50% 100%}
.rch .tbox::after{content:"";position:absolute;left:50%;bottom:-5px;width:9px;height:9px;margin-left:-5px;background:var(--panel);border-right:1px solid rgba(55,53,47,.08);border-bottom:1px solid rgba(55,53,47,.08);transform:rotate(45deg)}
.rch .tbox.reply{font-weight:500}
.rch .tg{display:inline-flex;align-items:center;height:22px;padding:0 7px;border-radius:6px;font-size:12px;font-weight:500}
.rch .tg.caution{color:#7a5a12;background:#fbf3db}
.rch .tg.route{color:rgb(28,107,58);background:rgb(219,237,219)}
.rch .tg.plain{color:rgb(75,74,71);background:rgb(239,239,237)}
@media (prefers-reduced-motion:reduce){.rch *{animation:none!important;transition:none!important}}
`;

export interface ColdEmailCrowdHeroProps {
  brand?: string;
  data?: Reach[];
  className?: string;
}

export function ColdEmailCrowdHero({ brand = "Reachable", data = DEFAULT_DATA, className = "" }: ColdEmailCrowdHeroProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current!;
    const $ = (s: string) => root.querySelector(s) as HTMLElement;
    const frozen = !!navigator.webdriver || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const A: typeof animate | null = frozen ? null : animate;
    let seed = frozen ? 11 : (Math.random() * 1e9) | 0;
    const rnd = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const ease = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

    const fx = $(".fx") as HTMLCanvasElement, g = fx.getContext("2d")!, dpr = Math.min(devicePixelRatio || 1, 2);
    let W = root.clientWidth, H = root.clientHeight;
    const size = () => { W = root.clientWidth; H = root.clientHeight; fx.width = W * dpr; fx.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();
    const ro = new ResizeObserver(size); ro.observe(root);

    /* the accent comes from the theme, so the beams match the background */
    const AC = getComputedStyle(root).getPropertyValue("--ac").trim() || "46,125,91", COL = `rgb(${AC})`, al = (o: number) => `rgba(${AC},${o})`;
    const BY = 444, TOP = 540, BH = 360;

    /* the crowd: people nobody has a reason to email stay faded; farther away = lighter */
    const crowd = $(".crowd"), P: any[] = [];
    crowd.innerHTML = "";
    const fade = (p: any) => `blur(${Math.max(0, (74 - p.t) * 0.045).toFixed(2)}px) contrast(${(0.36 + 0.3 * p.depth).toFixed(2)}) brightness(${(1 / (0.68 + 0.15 * p.depth)).toFixed(2)})`;
    function place(p: any, anywhere: boolean) {
      p.t = 31 + rnd() * 54; p.depth = (p.t - 31) / 54; p.w = 146 + (p.t - 31.8) * 2.62; p.h = p.w * 1.35;
      p.dir = rnd() < 0.5 ? 1 : -1; p.speed = 108 / (12 + rnd() * 26); p.x = anywhere ? -4 + rnd() * 108 : p.dir > 0 ? -10 : 110;
      p.v = 1; p.state = "walk"; p.reached = false; p.ph = rnd() * 6.283; p.f = 1.5 + p.speed * 0.22; p.bob = 0; p.px = (p.x / 100) * W;
      p.el.className = "pw"; p.el.style.cssText = `top:${p.t.toFixed(2)}%;width:${p.w.toFixed(1)}px;height:${p.h.toFixed(1)}px;z-index:${p.t | 0}`;
      p.img.src = PEEPS[(rnd() * PEEPS.length) | 0]; p.img.style.filter = fade(p); p.img.style.transform = `scaleX(${p.dir})`;
    }
    for (let i = 0; i < 42; i++) {
      const el = document.createElement("div");
      el.innerHTML = '<div class="pe"><div class="hp"><img alt="" draggable="false" decoding="async"><i class="ok"><svg viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg></i></div></div>';
      crowd.appendChild(el);
      const p = { el, pe: el.firstChild as HTMLElement, hp: el.firstChild!.firstChild as HTMLElement, img: el.querySelector("img")! };
      place(p, true); P.push(p);
    }
    const head = (p: any) => [p.px, TOP + (BH * p.t) / 100 - p.h / 2 + p.h * 0.3 + p.bob];

    /* three reaches can be in the air at once */
    const S: any[] = [0, 1, 2].map(() => {
      const tip = document.createElement("div"); tip.className = "tip"; tip.innerHTML = '<div class="cen"><div class="tbox"></div></div>'; root.appendChild(tip);
      return { tip, box: tip.querySelector(".tbox"), p: null };
    });
    const btile = $(".btile"), cbox = $(".cbox"), clab = $(".cbox .lab"), ctxt = $(".cbox .txt");
    let comp: any = null;
    const pop = (el: HTMLElement, on: boolean) => {
      if (A) A(el, { scale: on ? [0, 1] : [1, 0], opacity: on ? [0, 1] : [1, 0] }, on ? { type: "spring", stiffness: 420, damping: 22 } : { duration: 0.2 });
      else { el.style.transform = `scale(${on ? 1 : 0})`; el.style.opacity = on ? "1" : "0"; }
    };
    const flip = (s: any) => {
      const d = s.d, set = () => { s.box.className = "tbox reply"; s.box.innerHTML = `<span class="tg ${d.rc}">${d.rtag}</span>“${d.reply}”`; };
      if (A) A(s.box, { rotateX: [0, 90] }, { duration: 0.14, ease: "easeIn" }).then(() => { set(); A(s.box, { rotateX: [-90, 0] }, { type: "spring", stiffness: 480, damping: 20 }); });
      else set();
    };
    const hop = (p: any) => { if (A) A(p.hp, { y: [0, -26, 0], scale: [1, 1.06, 1] }, { duration: 0.6, ease: [0.3, 0, 0.3, 1] }); };
    const bump = (k: number) => { if (A) A(btile, { scale: [1, k, 1] }, { duration: 0.45, ease: [0.3, 0, 0.2, 1] }); };
    const hit = (c: string) => { if (frozen) return; const e = $("." + c); e.classList.remove("hit"); void e.offsetWidth; e.classList.add("hit"); };

    let side = 1, di = 0, nextAt = 0.6;
    function pick() {
      const act = S.filter((s) => s.p).map((s) => s.p.px), cx = W / 2;
      const ok = (p: any) => {
        if (p.state !== "walk" || p.reached || p.t < 47) return false;
        const f = p.px + ((p.dir * p.speed) / 100) * W * 2.4;
        return p.px > W * 0.13 && p.px < W * 0.87 && f > W * 0.1 && f < W * 0.9 && Math.abs(p.px - cx) > 120 && act.every((a) => Math.abs(a - p.px) > 400);
      };
      let c = P.filter(ok); const pref = c.filter((p) => (p.px - cx) * side > 0); if (pref.length) c = pref;
      if (!c.length) return null; side = -side; return c[(rnd() * c.length) | 0];
    }
    function start(now: number) {
      const s = S.find((s) => !s.p); if (!s) { nextAt = now + 0.2; return; }
      const p = pick(); if (!p) { nextAt = now + 0.3; return; }
      s.p = p; s.d = data[di++ % data.length]; s.t0 = now; s.st = 0; s.ly = 0; nextAt = now + 2.4;
      p.state = "locked"; p.el.style.zIndex = 200; p.img.style.filter = "none"; p.img.style.transform = `scaleX(${p.dir}) scale(1.07)`;
    }
    const envelope = (x: number, y: number, rot: number, sc: number) => {
      g.save(); g.translate(x, y); g.rotate(rot); g.scale(sc, sc); g.globalAlpha = 1; g.setLineDash([]); g.shadowColor = al(0.55); g.shadowBlur = 16; g.fillStyle = "#fff"; g.strokeStyle = COL; g.lineWidth = 2; g.lineJoin = "round";
      g.beginPath(); g.roundRect(-15, -10.5, 30, 21, 4); g.fill(); g.shadowBlur = 0; g.stroke(); g.beginPath(); g.moveTo(-12.5, -7.5); g.lineTo(0, 2.5); g.lineTo(12.5, -7.5); g.stroke(); g.restore();
    };

    function drawReach(s: any, a: number, now: number, hx: number, hy: number) {
      const p = s.p, P0 = [W / 2, BY], P1 = [(P0[0] + hx) / 2, Math.min(BY, hy) - (26 + Math.abs(hx - P0[0]) * 0.07)];
      const B = (u: number) => { const v = 1 - u; return [v * v * P0[0] + 2 * v * u * P1[0] + u * u * hx, v * v * P0[1] + 2 * v * u * P1[1] + u * u * hy]; };
      const seg = (u0: number, u1: number, n: number) => { g.beginPath(); for (let i = 0; i <= n; i++) { const q = B(u0 + ((u1 - u0) * i) / n); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); } g.stroke(); };
      g.strokeStyle = COL; g.lineCap = "round";
      if (a < 3.75) { /* target ring locks onto the head */
        const R = p.w * 0.27, k = Math.min(1, a / 0.5), e = 1 - Math.pow(1 - k, 3);
        g.save(); g.translate(hx, hy); g.rotate(now * 1.2); g.globalAlpha = 0.9 * k; g.lineWidth = 2; g.setLineDash([R * 0.5, R * 0.285]); g.beginPath(); g.arc(0, 0, R * (2.2 - 1.2 * e), 0, 6.2832); g.stroke(); g.restore();
      }
      if (a < 6.2) { /* the thread: dashed while aiming, solid while the reply comes back */
        g.save(); g.lineWidth = 1.2;
        if (a < 3.75) { g.globalAlpha = 0.55; g.setLineDash([3, 6]); g.lineDashOffset = -now * 24; seg(0, Math.min(1, a / 0.6), 28); }
        else { g.globalAlpha = 0.35 * Math.min(1, (6.2 - a) / 0.4); seg(0, 1, 28); }
        g.restore();
      }
      if (a >= 2.9 && a < 3.75) { /* the email is thrown along the arc */
        const u = ease((a - 2.9) / 0.85); g.save(); g.shadowColor = al(0.8); g.shadowBlur = 14;
        for (let i = 0; i < 14; i++) { const u1 = u - (0.46 * i) / 14, u0 = u - (0.46 * (i + 1)) / 14; if (u1 <= 0) break; const f = 1 - i / 14; g.globalAlpha = f * 0.22; g.lineWidth = 16 * f; seg(Math.max(0, u0), u1, 3); g.globalAlpha = f * 0.95; g.lineWidth = 6 * f + 1; seg(Math.max(0, u0), u1, 3); }
        g.restore(); const q = B(u), q2 = B(Math.min(1, u + 0.02)), dx = q2[0] - q[0];
        envelope(q[0], q[1], Math.atan2(q2[1] - q[1], Math.abs(dx) || 1e-6) * (dx >= 0 ? 1 : -1) * 0.6, Math.min(1, (a - 2.9) / 0.15));
      }
      if (a >= 3.75 && a < 4.4) { /* it lands */
        const k = (a - 3.75) / 0.65, e = 1 - Math.pow(1 - k, 3); g.save(); g.globalAlpha = 1 - k; g.lineWidth = 2.5; g.beginPath(); g.arc(hx, hy, p.w * 0.2 + e * p.w * 0.32, 0, 6.2832); g.stroke(); g.lineWidth = 2;
        for (let i = 0; i < 10; i++) { const an = (i / 10) * 6.2832 + s.t0, r0 = p.w * 0.3 + e * p.w * 0.22, r1 = r0 + 12 * (1 - k); g.beginPath(); g.moveTo(hx + Math.cos(an) * r0, hy + Math.sin(an) * r0); g.lineTo(hx + Math.cos(an) * r1, hy + Math.sin(an) * r1); g.stroke(); }
        g.restore();
      }
      if (a >= 5.3 && a < 6) { /* the reply travels back to the inbox */
        const u = 1 - ease((a - 5.3) / 0.7); g.save();
        for (let i = 0; i < 8; i++) { const u0 = u + (0.22 * i) / 8, u1 = u + (0.22 * (i + 1)) / 8; if (u0 >= 1) break; g.globalAlpha = (1 - i / 8) * 0.7; g.lineWidth = 3 * (1 - i / 10); seg(u0, Math.min(1, u1), 3); }
        const q = B(u); g.globalAlpha = 1; g.shadowColor = al(0.8); g.shadowBlur = 12; g.fillStyle = COL; g.beginPath(); g.arc(q[0], q[1], 6, 0, 6.2832); g.fill(); g.shadowBlur = 0; g.fillStyle = "#fff"; g.beginPath(); g.arc(q[0], q[1], 2.4, 0, 6.2832); g.fill(); g.restore();
      }
    }

    let mx = 0, tmx = 0;
    const onMove = (e: PointerEvent) => { tmx = (e.clientX - root.getBoundingClientRect().left) / W - 0.5; };
    addEventListener("pointermove", onMove);
    function tick(now: number, dt: number, draw: boolean) {
      mx += (tmx - mx) * Math.min(1, dt * 4);
      for (const p of P) {
        const tv = p.state === "walk" ? 1 : p.state === "locked" ? 0.45 : 0; p.v += (tv - p.v) * Math.min(1, dt * 5);
        p.x += p.dir * p.speed * p.v * dt; if ((p.x > 111 || p.x < -11) && p.state === "walk") place(p, false);
        const s = Math.sin(now * Math.PI * p.f + p.ph); p.bob = -Math.abs(s) * (1.5 + 2.5 * p.depth) * p.v; p.px = (p.x / 100) * W - mx * p.depth * W * 0.02;
        if (draw) p.pe.style.transform = `translate3d(${(p.px - p.w / 2).toFixed(1)}px,${(-p.h / 2 + p.bob).toFixed(1)}px,0) rotate(${(s * 0.7 * p.v).toFixed(2)}deg)`;
      }
      if (now >= nextAt) start(now);
      if (draw) g.clearRect(0, 0, W, H);
      for (const s of S) {
        if (!s.p) continue; const a = now - s.t0, p = s.p, d = s.d;
        if (s.st < 1 && a >= 0.9) { s.st = 1; s.box.className = "tbox"; s.box.innerHTML = `<span class="tg ${d.tc}">${d.tag}</span>${d.signal}`; pop(s.box, true); }
        if (s.st < 2 && a >= 1.8) { s.st = 2; comp = { d, t0: now, n: -1 }; clab.textContent = d.lab; ctxt.textContent = ""; pop(cbox, true); }
        if (s.st < 3 && a >= 2.9) { s.st = 3; if (comp && comp.d === d) { pop(cbox, false); comp = null; } bump(1.16); hit("p1"); } /* "Cold emails" lights up as one is thrown */
        if (s.st < 4 && a >= 3.75) { s.st = 4; p.state = "read"; p.reached = true; p.img.style.filter = `drop-shadow(0 0 14px ${al(0.6)})`; hop(p); }
        if (s.st < 5 && a >= 4.45) { s.st = 5; flip(s); hit("p2"); } /* "get replies." lights up as the reply arrives */
        if (s.st < 6 && a >= 6) { s.st = 6; bump(1.1); p.el.classList.add("done"); }
        if (s.st < 7 && a >= 6.7) { s.st = 7; pop(s.box, false); p.state = "walk"; p.el.style.zIndex = p.t | 0; p.img.style.transform = `scaleX(${p.dir})`; p.img.style.filter = `drop-shadow(0 0 8px ${al(0.45)})`; }
        if (a >= 7.1) { s.p = null; continue; }
        if (draw) {
          const [hx, hy] = head(p); s.hx = hx; s.ty = hy - p.h * 0.21 - 14;
          let lift = 0; for (const o of S) if (o !== s && o.p && o.t0 < s.t0 && Math.abs(o.hx - hx) < 350 && Math.abs(o.ty - s.ty) < 46) lift = -46; /* two bubbles never sit on each other */
          s.ly += (lift - s.ly) * Math.min(1, dt * 8); s.tip.style.transform = `translate(${hx.toFixed(1)}px,${(s.ty + s.ly).toFixed(1)}px)`; drawReach(s, a, now, hx, hy);
        }
      }
      if (comp) { const L = comp.d.line, n = Math.ceil(Math.min(1, (now - comp.t0) / 0.8) * L.length); if (n !== comp.n) { comp.n = n; ctxt.textContent = L.slice(0, n); } }
    }

    let raf = 0;
    if (frozen) { /* screenshots and reduced motion: run until an email is in the air, then hold that frame */
      let i = 0; for (; i < 1500; i++) { tick(i / 60, 1 / 60, false); if (i > 420 && S.filter((s) => s.p).length > 1 && S.some((s) => s.p && i / 60 - s.t0 > 3.32 && i / 60 - s.t0 < 3.4)) break; }
      tick(i / 60, 0, true); $(".p1").classList.add("lit");
    } else {
      animate(root.querySelectorAll("h1 .w"), { opacity: [0, 1], y: [28, 0], filter: ["blur(10px)", "blur(0px)"] }, { duration: 0.9, ease: [0.2, 0.7, 0.2, 1], delay: stagger(0.08) });
      animate(root.querySelectorAll(".kick,.lead,.ctas"), { opacity: [0, 1], y: [16, 0] }, { duration: 0.8, ease: [0.2, 0.7, 0.2, 1], delay: stagger(0.1, { startDelay: 0.25 }) });
      animate(btile, { scale: [0, 1] }, { type: "spring", stiffness: 300, damping: 16, delay: 0.6 });
      animate(crowd, { opacity: [0, 1] }, { duration: 0.9 });
      /* frames can come slowly in a busy tab: let the clock catch up so the loop stays in real time */
      let last = performance.now(), now = 0;
      const loop = (ms: number) => { const dt = Math.min(0.25, Math.max(0, (ms - last) / 1000)); last = ms; now += dt; tick(now, dt, true); raf = requestAnimationFrame(loop); };
      loop(last);
    }

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); removeEventListener("pointermove", onMove);
      S.forEach((s) => s.tip.remove()); crowd.innerHTML = "";
    };
  }, [data]);

  return (
    <div ref={ref} className={`rch ${className}`}>
      <style>{CSS}</style>
      <div className="bg" aria-hidden="true">
        <i className="b1" /><i className="b2" /><i className="b3" /><i className="b4" />
        <div className="dome" />
        <svg className="grain"><filter id="rch-n"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves={2} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#rch-n)" /></svg>
      </div>
      <header className="nav"><div className="in">
        <a className="brand" href="#"><img src={LOGO} alt="" />{brand}</a>
        <nav className="links"><a href="#">Signals</a><a href="#">Tables</a><a href="#">Campaigns</a><a href="#">Inbox</a><a href="#">Free tools</a><a href="#">Pricing</a></nav>
        <div className="acts"><a className="btn ghost" href="#">Sign in</a><a className="btn pri" href="#">Start free</a></div>
      </div></header>
      <main className="hero">
        <span className="kick"><i />Signal-led outbound</span>
        <h1><span className="ph p1"><span className="w">Cold</span> <span className="w">emails</span></span> <span className="w">that</span> <span className="ph p2"><em><span className="w">get</span> <span className="w">replies.</span></em></span></h1>
        <p className="lead">{brand} watches for buying signals, researches every account, writes a first line that cites the trigger, and runs the sequence from your own inboxes. One workspace instead of five tools.</p>
        <div className="ctas"><a className="btn pri" href="#">Start free — 14 days, 300 credits</a><a className="btn" href="#">See how it works</a></div>
      </main>
      <div className="crowd" aria-hidden="true" />
      <canvas className="fx" aria-hidden="true" />
      <div className="beacon" aria-hidden="true"><div className="btile"><img src={MARK} alt="" /></div></div>
      <div className="compose" aria-hidden="true"><div className="cen"><div className="cbox"><span className="lab" /><span className="txt" /><i className="caret" /></div></div></div>
    </div>
  );
}

export default ColdEmailCrowdHero;
