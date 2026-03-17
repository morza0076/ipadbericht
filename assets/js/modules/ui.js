
export const qs = (sel, root=document)=> root.querySelector(sel);
export const qsa = (sel, root=document)=> Array.from(root.querySelectorAll(sel));
export const on = (sel, ev, fn, root=document)=>{ const el = qs(sel, root); if(el) el.addEventListener(ev, fn); };

export function showToast(msg, type='info'){
  const c = qs('#toast-container'); if(!c) return;
  const t = document.createElement('div');
  t.className = `toast toast--${type}`;
  t.textContent = msg;
  c.appendChild(t);
  requestAnimationFrame(()=> t.classList.add('show'));
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=> t.remove(), 220); }, 3000);
}

export function autoResizeTextarea(el){ el.style.height='auto'; el.style.height = el.scrollHeight+'px'; }
