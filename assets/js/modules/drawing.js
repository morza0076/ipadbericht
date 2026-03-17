
export function initDrawing(sel){
  const cvs = document.querySelector(sel); if(!cvs) return;
  const ctx = cvs.getContext('2d');
  const dpr = window.devicePixelRatio||1;
  function resize(){ const r=cvs.getBoundingClientRect(); const t=cvs.toDataURL(); cvs.width=r.width*dpr; cvs.height=r.height*dpr; const i=new Image(); i.onload=()=>ctx.drawImage(i,0,0,cvs.width,cvs.height); i.src=t; }
  setTimeout(resize, 50); window.addEventListener('resize', ()=> setTimeout(resize, 50));

  let drawing=false, last=null, mode='pen';
  const history=[]; function save(){ if(history.length>30) history.shift(); history.push(cvs.toDataURL()); }
  save();
  cvs.addEventListener('pointerdown', e=>{ drawing=true; const r=cvs.getBoundingClientRect(); last={x:(e.clientX-r.left)*dpr, y:(e.clientY-r.top)*dpr}; ctx.beginPath(); ctx.moveTo(last.x,last.y); });
  cvs.addEventListener('pointermove', e=>{
    if(!drawing) return; const r=cvs.getBoundingClientRect(); const x=(e.clientX-r.left)*dpr, y=(e.clientY-r.top)*dpr;
    if(mode==='erase'){ ctx.globalCompositeOperation='destination-out'; ctx.lineWidth=16*dpr; } else { ctx.globalCompositeOperation='source-over'; ctx.strokeStyle='#111'; ctx.lineWidth=2*dpr; }
    ctx.lineTo(x,y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x,y);
  });
  window.addEventListener('pointerup', ()=>{ if(drawing){ save(); drawing=false; }});
  // Simple UI hooks (optional): press E to toggle eraser
  window.addEventListener('keydown', (e)=>{ if(e.key==='e'||e.key==='E'){ mode = (mode==='erase'?'pen':'erase'); }});
}
