
import { showToast } from './ui.js';

export function initPhotos(inputSel, gridSel){
  const inp = document.querySelector(inputSel); const grid=document.querySelector(gridSel);
  if(!inp||!grid) return;
  inp.addEventListener('change', async ()=>{
    if(!inp.files||!inp.files.length) return; document.getElementById('loadingOverlay').classList.remove('hidden');
    for(const f of Array.from(inp.files)){
      await new Promise(res=>{ const r=new FileReader(); r.onload = e=> scaleAndInsert(e.target.result, grid, res); r.readAsDataURL(f); });
    }
    inp.value=''; document.getElementById('loadingOverlay').classList.add('hidden'); showToast('Fotos hinzugefügt','success');
  });
}

function scaleAndInsert(url, grid, cb){
  const img=new Image(); img.onload=()=>{
    const max=1000; let w=img.width, h=img.height; if(w>h && w>max){ h*=max/w; w=max; } else if(h>max){ w*=max/h; h=max; }
    const c=document.createElement('canvas'); c.width=w; c.height=h; c.getContext('2d').drawImage(img,0,0,w,h);
    const box=document.createElement('figure'); box.className='photo-box'; box.style.margin='0'; box.style.border='1px solid var(--border)'; box.style.borderRadius='8px'; box.style.overflow='hidden';
    const pic=document.createElement('img'); pic.src=c.toDataURL('image/webp', 0.7); pic.alt='Foto'; pic.style.width='100%'; pic.style.display='block'; pic.loading='lazy';
    const cap=document.createElement('figcaption'); cap.contentEditable='true'; cap.innerText='Beschreibung…'; cap.style.fontSize='12px'; cap.style.padding='6px 8px'; cap.style.color='var(--muted)';
    const del=document.createElement('button'); del.textContent='×'; del.title='Entfernen'; del.className='btn'; del.style.position='absolute'; del.style.right='6px'; del.style.top='6px'; del.style.padding='4px 8px';
    const wrap=document.createElement('div'); wrap.style.position='relative'; wrap.appendChild(pic); wrap.appendChild(del);
    box.appendChild(wrap); box.appendChild(cap); grid.appendChild(box);
    del.addEventListener('click', ()=>{ box.remove(); });
    cb&&cb();
  }; img.src=url;
}
