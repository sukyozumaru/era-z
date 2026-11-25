/* Era Z — componentes de interfaz reutilizables (base de la propuesta UI/UX, ver docs/PROPUESTA-UI-UX.md).
   confirmDlg({title,msg,ok,cancel,danger,onOk,onCancel}): diálogo de confirmación. Esc cancela. El foco inicial es «cancelar» (seguro). */
function confirmDlg(o){
 U.innerHTML=`<div class="pn dlg ${o.danger?'dlg-danger':''}" role="alertdialog" aria-labelledby="dlg-t"><h2 id="dlg-t">${o.title}</h2><p>${o.msg}</p><div class="dlg-row"><button id="dlg-no">${o.cancel||'Cancelar'}</button><button id="dlg-ok" class="${o.danger?'btn-danger':''}">${o.ok||'Aceptar'}</button></div></div>`;
 const k=e=>{if(e.key==='Escape'){e.preventDefault();no()}},off=()=>document.removeEventListener('keydown',k),no=()=>{off();o.onCancel&&o.onCancel()};
 document.addEventListener('keydown',k);
 document.getElementById('dlg-no').onclick=no;document.getElementById('dlg-ok').onclick=()=>{off();o.onOk&&o.onOk()};
 if(!INP.touch)document.getElementById('dlg-no').focus()}
/* Monedas que se perderían al abandonar la partida actual (misma fórmula que endRun). */
const coinsAtStake=()=>Math.round((K*.5+T/5+BG)*MD.g);
