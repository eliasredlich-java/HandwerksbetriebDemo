/* Gemeinsame Interaktionen der Unterseiten (ueber-uns.html, karriere.html).
   Die Startseite bringt dieselbe Logik inline mit — dieses Skript dort NICHT
   zusaetzlich einbinden, sonst reagieren Menue und Dialoge doppelt. */
(()=>{
  /* Mobile-Menue */
  const menuButton=document.querySelector('#menu-button'),mobileMenu=document.querySelector('#mobile-menu');
  if(menuButton&&mobileMenu){
    menuButton.addEventListener('click',()=>{
      const open=menuButton.getAttribute('aria-expanded')==='true';
      menuButton.setAttribute('aria-expanded',String(!open));
      menuButton.setAttribute('aria-label',open?'Menü öffnen':'Menü schließen');
      mobileMenu.hidden=open;
    });
    mobileMenu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
      menuButton.setAttribute('aria-expanded','false');
      menuButton.setAttribute('aria-label','Menü öffnen');
      mobileMenu.hidden=true;
    }));
  }

  /* Dialog-Grundgeruest: oeffnen, schliessen, Fokus halten und zurueckgeben */
  const setupModal=(modal,closeButton)=>{
    const dialog=modal.querySelector('[role="dialog"]');
    let lastFocus;
    const close=()=>{modal.hidden=true;document.body.classList.remove('modal-open');if(lastFocus)lastFocus.focus()};
    const open=focusTarget=>{lastFocus=document.activeElement;modal.hidden=false;document.body.classList.add('modal-open');(focusTarget||closeButton).focus()};
    closeButton.addEventListener('click',close);
    modal.addEventListener('click',event=>{if(event.target===modal)close()});
    document.addEventListener('keydown',event=>{
      if(modal.hidden)return;
      if(event.key==='Escape'){close();return}
      if(event.key!=='Tab')return;
      const focusable=dialog.querySelectorAll('button,a,input,select,textarea,[tabindex]:not([tabindex="-1"])'),first=focusable[0],last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    });
    return {open,close};
  };

  /* Impressum / Datenschutz (Texte aus js/legal.js) */
  const legalModal=document.querySelector('#legal-modal'),legalClose=document.querySelector('#modal-close');
  if(legalModal&&legalClose&&window.NK_LEGAL){
    const legal=setupModal(legalModal,legalClose);
    const title=legalModal.querySelector('#modal-title'),content=legalModal.querySelector('#modal-content');
    document.querySelectorAll('[data-modal]').forEach(link=>link.addEventListener('click',event=>{
      const data=window.NK_LEGAL[link.dataset.modal];if(!data)return;
      event.preventDefault();title.textContent=data[0];content.innerHTML=data[1];legal.open();
    }));
  }

  /* Quick-Bewerbung (nur karriere.html) — Demo: nichts wird uebertragen */
  const applyModal=document.querySelector('#quick-apply-modal'),applyClose=document.querySelector('#quick-apply-close');
  const form=document.querySelector('#quick-apply-form'),status=document.querySelector('#quick-apply-status');
  if(applyModal&&applyClose&&form&&status){
    const apply=setupModal(applyModal,applyClose);
    const roleField=document.querySelector('#qa-role');
    document.querySelectorAll('[data-apply]').forEach(button=>button.addEventListener('click',()=>{
      if(roleField&&button.dataset.apply)roleField.value=button.dataset.apply;
      apply.open(document.querySelector('#qa-name'));
    }));
    form.addEventListener('submit',event=>{
      event.preventDefault();
      const name=document.querySelector('#qa-name').value.trim();
      form.hidden=true;status.hidden=false;
      status.textContent=`Vielen Dank für die Demo-Anfrage${name?`, ${name}`:''}! Dies ist eine Test-Erfolgsmeldung – Ihre Angaben wurden nicht übertragen und niemand wird kontaktiert.`;
    });
  }
})();
