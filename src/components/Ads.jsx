import React, { useEffect } from 'react';

const Ads = () => {
    useEffect(() => {
        const timeoutId = setTimeout(() => {
          if (window.googletag && window.googletag.cmd) {
            window.googletag.cmd.push(() => {
              const existingSlots = window.googletag.pubads().getSlots();
              const slotExists = existingSlots.some(
                (slot) => slot.getSlotElementId() === 'div-gpt-ad-1614955491295-0'
              );
    
              if (!slotExists) {
                const slot = window.googletag.defineSlot(
                  '/18190176,22647288479/MCM_Validation', // Your ad slot
                  [300, 250], // Ad dimensions
                  'div-gpt-ad-1614955491295-0' // Ad container ID
                );
    
                if (slot) {
                  slot.addService(window.googletag.pubads());
                  window.googletag.pubads().enableSingleRequest();
                  window.googletag.enableServices();
                }
              }
    
              window.googletag.display('div-gpt-ad-1614955491295-0');
              window.googletag.pubads().refresh(['div-gpt-ad-1614955491295-0']);
            });
          }
        }, 5000); // Delay of 5 seconds
    
        return () => clearTimeout(timeoutId);
      }, []);
    

  return (
    <>
    <div
        id="div-gpt-ad-1614955491295-0"
        style={{ minWidth: '300px', maxHeight: '250px' }}
      ></div>
    </>
   
  );
};

export default Ads;
