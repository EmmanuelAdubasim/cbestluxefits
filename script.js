
    (function(){
      const track = document.getElementById('productTrack');
      if(!track) return;

      const buttons = document.querySelectorAll('.slider-controls .icon-btn');
      const scrollByCard = (dir) => {
        const firstCard = track.querySelector('.slide');
        const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 280;
        track.scrollBy({ left: dir * (cardWidth + 18), behavior: 'smooth' });
      };

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const dir = Number(btn.getAttribute('data-dir')) || 1;
          scrollByCard(dir);
        });
      });
    })();



    (function(){
      const setupSlider = (trackSelector, btnSelector) => {
        const track = document.querySelector(trackSelector);
        if(!track) return;
        const btns = document.querySelectorAll(btnSelector);
        const firstCard = track.querySelector('.slide');
        const cardWidth = () => (firstCard ? firstCard.getBoundingClientRect().width : 280) + 18;

        // Buttons
        btns.forEach(btn => btn.addEventListener('click', () => {
          const dir = Number(btn.getAttribute('data-dir')) || 1;
          const targetSel = btn.getAttribute('data-target');
          const t = targetSel ? document.querySelector(targetSel) : track;
          if(!t) return;
          t.scrollBy({ left: dir * cardWidth(), behavior: 'smooth' });
        }));

        // Auto-scroll (pause on hover/touch)
        let auto = setInterval(()=> track.scrollBy({left: cardWidth(), behavior:'smooth'}), 3500);
        const pause = ()=> clearInterval(auto);
        const resume = ()=> auto = setInterval(()=> track.scrollBy({left: cardWidth(), behavior:'smooth'}), 3500);
        ['mouseenter','touchstart','focusin'].forEach(e=>track.addEventListener(e,pause));
        ['mouseleave','touchend','focusout'].forEach(e=>track.addEventListener(e,resume));
      };

      // Setup both sliders
      setupSlider('#productTrack', '.slider-controls .icon-btn:not([data-target])');
      setupSlider('#newTrack', '.slider-controls .icon-btn[data-target="#newTrack"]');

      // Category Tabs (filter)
      const tabs = document.getElementById('productTabs');
      const track = document.getElementById('productTrack');
      if(tabs && track){
        tabs.addEventListener('click', (e)=>{
          const btn = e.target.closest('.tab');
          if(!btn) return;
          tabs.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
          btn.classList.add('active');
          const cat = btn.getAttribute('data-cat');
          track.querySelectorAll('.slide').forEach(card=>{
            const show = cat==='All' || card.getAttribute('data-cat')===cat;
            card.style.display = show ? '' : 'none';
          });
        });
      }
    })();