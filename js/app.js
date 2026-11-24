/**
 * SmartPark LPU - Main Application Controller
 * Handles Home, Saved Ticket, and Find My Vehicle pages
 * Includes Cinematic Car Drive-In Intro & Interactive Hero Vehicle Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  initGlobalNav();
  initThemeToggle();
  initToastContainer();

  const page = document.body.dataset.page;
  if (page === 'home') {
    initHomePage();
    initHeroCarWidget();
  } else if (page === 'saved') {
    initSavedPage();
  } else if (page === 'find') {
    initFindPage();
  }
});

/* ==========================================================================
   HERO CAR INTERACTIVE WIDGET (Headlights, Hazard Blinkers, Spot Sync)
   ========================================================================== */
function initHeroCarWidget() {
  const carCard = document.getElementById('hero-car-card');
  const toggleHeadlightsBtn = document.getElementById('btn-toggle-headlights');
  const flashHazardsBtn = document.getElementById('btn-flash-hazards');
  const bayStatus = document.getElementById('hero-bay-status');

  if (!carCard) return;

  // Toggle Headlights
  if (toggleHeadlightsBtn) {
    toggleHeadlightsBtn.addEventListener('click', () => {
      const isActive = carCard.classList.toggle('hero-headlights-active');
      showToast(isActive ? '💡 Headlights turned ON' : '💡 Headlights turned OFF', 'success', 1500);
    });
  }

  // Flash Hazards / Locate
  if (flashHazardsBtn) {
    flashHazardsBtn.addEventListener('click', () => {
      carCard.classList.add('hazards-active');
      showToast('🚨 Beep Beep! Flashing hazard lights...', 'success', 2500);

      setTimeout(() => {
        carCard.classList.remove('hazards-active');
      }, 3500);
    });
  }

  // Sync with active saved parking
  const saved = SmartParkStorage.get();
  if (saved && bayStatus) {
    bayStatus.textContent = `Parked: Zone ${saved.zoneKey} (${saved.rowNumber})`;
  }
}

/* ==========================================================================
   Global Theme Toggle
   ========================================================================== */
function initThemeToggle() {
  ThemeManager.applyTheme();

  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const newTheme = ThemeManager.toggleTheme();
      showToast(`Switched to ${newTheme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}`, 'success', 2000);
    });
  });
}

/* ==========================================================================
   Global Toast Notification System
   ========================================================================== */
function initToastContainer() {
  if (!document.getElementById('toast-container')) {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

function showToast(message, type = 'success', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconSvg = type === 'success'
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  toast.innerHTML = `
    <span class="toast-icon">${iconSvg}</span>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 200ms ease';
    setTimeout(() => toast.remove(), 200);
  }, duration);
}

/* ==========================================================================
   Navigation Bar & Active Spot Badging
   ========================================================================== */
function initGlobalNav() {
  const savedData = SmartParkStorage.get();
  const navFindBtn = document.getElementById('nav-find-btn');
  const activeDot = document.getElementById('nav-active-dot');

  if (navFindBtn && activeDot) {
    if (savedData) {
      activeDot.style.display = 'inline-block';
      navFindBtn.setAttribute('title', `Active spot: Zone ${savedData.zoneKey}, Row ${savedData.rowNumber}`);
    } else {
      activeDot.style.display = 'none';
    }
  }
}

/* ==========================================================================
   Home Page Controller - Visual Parking Lot & Smart Recommendation Engine
   ========================================================================== */
function initHomePage() {
  const destinationSelect = document.getElementById('destination-select');
  const destChips = document.querySelectorAll('.dest-bar-chip');
  const zoneTabBtns = document.querySelectorAll('.zone-tab-btn');
  const slotsMatrix = document.getElementById('visual-slots-matrix');
  const suggestBtn = document.getElementById('btn-suggest-best-slot');
  const saveBtn = document.getElementById('btn-save-details');
  const activeBanner = document.getElementById('home-active-banner');
  const updateBanner = document.getElementById('update-mode-banner');
  const bayStatus = document.getElementById('hero-bay-status');

  // Overview Panel Elements
  const panelSlotId = document.getElementById('panel-slot-id');
  const panelZoneTag = document.getElementById('panel-zone-tag');
  const panelWalkDist = document.getElementById('panel-walk-dist');
  const panelDestName = document.getElementById('panel-destination-name');
  const panelAmenities = document.getElementById('panel-amenities');
  const panelStatusVal = document.getElementById('panel-status-val');
  const suggBannerReason = document.getElementById('sugg-banner-reason');

  // Zone Info Banner Elements
  const currentZoneTitle = document.getElementById('current-zone-title');
  const currentZoneLandmark = document.getElementById('current-zone-landmark');
  const zoneStatAvail = document.getElementById('zone-stat-avail');
  const zoneStatWalkText = document.getElementById('zone-stat-walk-text');

  const currentSaved = SmartParkStorage.get();
  const urlParams = new URLSearchParams(window.location.search);
  const isEditMode = urlParams.get('edit') === 'true' && currentSaved !== null;

  let currentDestination = destinationSelect ? destinationSelect.value : 'academic';
  let currentZoneKey = 'B'; // default to Zone B (Available & Recommended)
  let currentSlotId = 'B-04'; // default selected slot
  let activeSuggestedSlotId = 'B-04';

  // Helper: Create Vector Top-Down Car Graphic for Occupied Slots (Reference Image 2)
  function createTopDownCarSvg(color = '#e2e8f0') {
    return `
      <svg viewBox="0 0 60 100" class="topdown-car-svg" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="54" height="94" rx="12" fill="#000000" opacity="0.3" filter="blur(2px)"/>
        <rect x="5" y="4" width="50" height="92" rx="10" fill="${color}" stroke="#1e293b" stroke-width="1.5"/>
        <path d="M10 24 Q30 18 50 24 L46 38 Q30 34 14 38 Z" fill="#0f172a"/>
        <path d="M14 74 Q30 78 46 74 L44 84 Q30 86 16 84 Z" fill="#0f172a"/>
        <rect x="11" y="40" width="3" height="32" rx="1" fill="#0f172a"/>
        <rect x="46" y="40" width="3" height="32" rx="1" fill="#0f172a"/>
        <rect x="16" y="40" width="28" height="32" rx="3" fill="${color}" filter="brightness(0.9)"/>
        <ellipse cx="12" cy="7" rx="3.5" ry="2" fill="#fef08a"/>
        <ellipse cx="48" cy="7" rx="3.5" ry="2" fill="#fef08a"/>
        <ellipse cx="12" cy="93" rx="3.5" ry="2" fill="#ef4444"/>
        <ellipse cx="48" cy="93" rx="3.5" ry="2" fill="#ef4444"/>
      </svg>
    `;
  }

  // Edit Mode or Active Banner setup
  if (isEditMode) {
    if (updateBanner) updateBanner.style.display = 'flex';
    if (saveBtn) {
      saveBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Update Parking Spot</span>
      `;
    }

    currentDestination = currentSaved.destinationKey;
    if (destinationSelect) destinationSelect.value = currentDestination;
    currentZoneKey = currentSaved.zoneKey;
    currentSlotId = currentSaved.rowNumber;

    const cancelEditBtn = document.getElementById('btn-cancel-update');
    if (cancelEditBtn) {
      cancelEditBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }
  } else if (currentSaved && activeBanner) {
    activeBanner.style.display = 'flex';
    document.getElementById('banner-spot-text').textContent =
      `${currentSaved.destinationName} • Zone ${currentSaved.zoneKey} (${currentSaved.rowNumber})`;

    const bannerChangeBtn = document.getElementById('banner-change-btn');
    if (bannerChangeBtn) {
      bannerChangeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'index.html?edit=true';
      });
    }

    const bannerClearBtn = document.getElementById('banner-clear-btn');
    if (bannerClearBtn) {
      bannerClearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Clear your saved vehicle location?')) {
          SmartParkStorage.clear();
          activeBanner.style.display = 'none';
          initGlobalNav();
          if (bayStatus) bayStatus.textContent = 'Campus Parking Bay';
          showToast('Saved parking cleared', 'warning');
        }
      });
    }
  }

  // Destination Change Handler
  function updateDestination(destKey) {
    currentDestination = destKey;
    if (destinationSelect) destinationSelect.value = destKey;

    destChips.forEach(chip => {
      if (chip.dataset.dest === destKey) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    // Auto-calculate smart suggestion for new destination
    const destObj = CAMPUS_DATA.destinations[destKey];
    const suggestion = CAMPUS_DATA.suggestBestSlot(destObj ? destObj.shortName : destKey);
    activeSuggestedSlotId = suggestion.slotId;

    if (currentZoneKey !== suggestion.zoneKey) {
      setZone(suggestion.zoneKey);
    } else {
      renderVisualSlots();
      updateOverviewPanel();
    }
  }

  destChips.forEach(chip => {
    chip.addEventListener('click', () => {
      updateDestination(chip.dataset.dest);
    });
  });

  if (destinationSelect) {
    destinationSelect.addEventListener('change', () => {
      updateDestination(destinationSelect.value);
    });
  }

  // Zone Switcher Handler
  function setZone(zoneKey) {
    currentZoneKey = zoneKey;

    zoneTabBtns.forEach(btn => {
      if (btn.dataset.zone === zoneKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const zoneInfo = CAMPUS_DATA.zones[zoneKey];
    if (zoneInfo) {
      if (currentZoneTitle) currentZoneTitle.textContent = `${zoneInfo.title} • ${zoneInfo.subtitle}`;
      if (currentZoneLandmark) currentZoneLandmark.textContent = zoneInfo.landmark;
      if (zoneStatAvail) {
        zoneStatAvail.textContent = zoneInfo.availableSpots > 0 ? `🟢 ${zoneInfo.availableSpots} Free` : `🔴 0 Free (FULL)`;
      }
      const destObj = CAMPUS_DATA.destinations[currentDestination];
      if (zoneStatWalkText && destObj && destObj.walkingTimes[zoneKey]) {
        zoneStatWalkText.textContent = destObj.walkingTimes[zoneKey];
      }
    }

    renderVisualSlots();
    updateOverviewPanel();
  }

  zoneTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setZone(btn.dataset.zone);
    });
  });

  // Render Visual Parking Slots Grid (Reference Images 1, 2 & 3)
  // Render Visual Parking Slots Grid (Reference Images 1, 2 & 3)
  function renderVisualSlots() {
    if (!slotsMatrix) return;
    slotsMatrix.innerHTML = '';

    const zoneInfo = CAMPUS_DATA.zones[currentZoneKey];
    if (!zoneInfo || !zoneInfo.slots) return;

    zoneInfo.slots.forEach(slot => {
      const isOccupied = slot.status === 'occupied';
      const isMySpot = !!slot.isBookedByMe;
      const isBookedByOther = !!slot.isBookedByOther;
      const isSuggested = slot.id === activeSuggestedSlotId && !isOccupied;
      const isSelected = slot.id === currentSlotId;

      const bayDiv = document.createElement('div');
      bayDiv.className = `slot-bay ${isOccupied ? 'occupied' : 'available'} ${isMySpot ? 'is-my-spot' : ''} ${isBookedByOther ? 'booked-by-other' : ''} ${isSuggested ? 'suggested' : ''} ${isSelected ? 'selected' : ''}`;
      bayDiv.dataset.slotId = slot.id;

      if (isMySpot) {
        bayDiv.innerHTML += `
          <span class="my-spot-badge">★ YOUR SPOT</span>
        `;
      } else if (isSuggested) {
        bayDiv.innerHTML += `
          <span class="suggested-beacon-badge">⭐ BEST SPOT</span>
        `;
      }

      // Slot top ID
      const idTag = document.createElement('span');
      idTag.className = 'bay-id-tag';
      idTag.textContent = slot.id;
      bayDiv.appendChild(idTag);

      if (isMySpot) {
        // Render user's own parked car in the bay
        const carHtml = createTopDownCarSvg('#38bdf8');
        const carWrap = document.createElement('div');
        carWrap.innerHTML = carHtml;
        bayDiv.appendChild(carWrap.firstElementChild);

        const platePill = document.createElement('span');
        platePill.className = 'bay-car-plate my-plate';
        platePill.textContent = slot.vehicleNumber || 'YOUR CAR';
        bayDiv.appendChild(platePill);

        bayDiv.addEventListener('click', () => {
          showToast(`ℹ️ Bay ${slot.id} is your currently saved parking spot.`, 'info', 2500);
        });
      } else if (isOccupied) {
        // Render Top-Down Car Vector for Occupied Bay
        const carColor = isBookedByOther ? (slot.carColor || '#ef4444') : (slot.carColor || '#94a3b8');
        const carHtml = createTopDownCarSvg(carColor);
        const carWrap = document.createElement('div');
        carWrap.innerHTML = carHtml;
        bayDiv.appendChild(carWrap.firstElementChild);

        const platePill = document.createElement('span');
        platePill.className = 'bay-car-plate';
        platePill.textContent = slot.vehicleNumber ? slot.vehicleNumber : (slot.carModel || 'TAKEN');
        bayDiv.appendChild(platePill);

        // Click on occupied bay to provide friendly feedback
        bayDiv.addEventListener('click', () => {
          const detail = slot.vehicleNumber ? `vehicle ${slot.vehicleNumber}` : (slot.carModel || 'another driver');
          showToast(`⚠️ Bay ${slot.id} is occupied by ${detail}. Please tap an open green bay or click "✨ Suggest Where to Park"!`, 'warning', 3500);
        });
      } else {
        // Available Open Bay
        const availIndicator = document.createElement('div');
        availIndicator.className = 'bay-avail-indicator';
        availIndicator.innerHTML = `
          <div class="bay-p-symbol">P</div>
          <span>FREE</span>
        `;
        bayDiv.appendChild(availIndicator);

        // Click to select available slot
        bayDiv.addEventListener('click', () => {
          currentSlotId = slot.id;
          slotsMatrix.querySelectorAll('.slot-bay').forEach(b => b.classList.remove('selected'));
          bayDiv.classList.add('selected');

          if (bayStatus) {
            bayStatus.textContent = `Selected: Zone ${currentZoneKey} (${slot.id})`;
          }

          updateOverviewPanel();
        });
      }

      slotsMatrix.appendChild(bayDiv);
    });
  }

  // Update Right Overview Side Panel
  function updateOverviewPanel() {
    const destObj = CAMPUS_DATA.destinations[currentDestination];
    const zoneInfo = CAMPUS_DATA.zones[currentZoneKey];
    const suggestion = CAMPUS_DATA.suggestBestSlot(destObj ? destObj.shortName : currentDestination);

    if (panelSlotId) panelSlotId.textContent = `Bay ${currentSlotId || 'None'}`;
    if (panelZoneTag) panelZoneTag.textContent = `ZONE ${currentZoneKey}`;
    if (panelDestName && destObj) panelDestName.textContent = destObj.shortName;

    if (suggBannerReason && suggestion) {
      suggBannerReason.textContent = suggestion.reason;
    }

    if (zoneInfo && destObj) {
      const walkTime = destObj.walkingTimes[currentZoneKey] || '3 mins';
      if (panelWalkDist) panelWalkDist.textContent = walkTime;

      if (panelAmenities && zoneInfo.features) {
        panelAmenities.textContent = zoneInfo.features.join(' • ');
      }

      if (panelStatusVal) {
        if (zoneInfo.availableSpots > 0) {
          panelStatusVal.textContent = '🟢 Ready to Park';
          panelStatusVal.className = 'detail-val status-val-avail';
          panelStatusVal.style.color = '';
        } else {
          panelStatusVal.textContent = '🔴 Zone Full';
          panelStatusVal.className = 'detail-val';
          panelStatusVal.style.color = 'var(--status-full)';
        }
      }
    }

    if (saveBtn) {
      saveBtn.disabled = !currentSlotId || (zoneInfo && zoneInfo.availableSpots === 0);
    }
  }

  // "Suggest Where to Park" Button Handler (Reference Image 1 & 3)
  if (suggestBtn) {
    suggestBtn.addEventListener('click', () => {
      const destObj = CAMPUS_DATA.destinations[currentDestination];
      const suggestion = CAMPUS_DATA.suggestBestSlot(destObj ? destObj.shortName : currentDestination);

      currentSlotId = suggestion.slotId;
      activeSuggestedSlotId = suggestion.slotId;

      if (currentZoneKey !== suggestion.zoneKey) {
        setZone(suggestion.zoneKey);
      } else {
        renderVisualSlots();
        updateOverviewPanel();
      }

      // Smooth scroll to the visual parking lot
      const lotFloor = document.getElementById('parking-lot-floor');
      if (lotFloor) {
        lotFloor.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      showToast(`✨ Recommended: Bay ${suggestion.slotId} is the fastest spot for ${destObj ? destObj.shortName : 'your destination'}!`, 'success', 3500);
    });
  }

  // Save Details / Park Here Button with Real-Time Cloud Sync & Double-Booking Protection
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      if (!currentZoneKey || !currentSlotId) {
        showToast('Please tap an available slot on the map first.', 'warning');
        return;
      }

      const destObj = CAMPUS_DATA.destinations[currentDestination];
      const zoneObj = CAMPUS_DATA.zones[currentZoneKey];
      const milestones = (destObj.milestones && destObj.milestones[currentZoneKey]) ? destObj.milestones[currentZoneKey] : [];

      // Disable button and show spinner
      saveBtn.disabled = true;
      saveBtn.innerHTML = `
        <svg class="spin-loader" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        <span>Verifying Bay ${currentSlotId}...</span>
      `;

      // 1. Cross-Device Live Slot Booking & Collision Check
      if (window.SmartParkSync) {
        const syncResult = await window.SmartParkSync.bookSlot({
          slotId: currentSlotId,
          zoneKey: currentZoneKey,
          destination: destObj ? destObj.name : 'Academic Block',
          vehicleNumber: 'PB-08-LP-2024',
          vehicleModel: 'Swift Sedan',
          carColor: '#38bdf8'
        });

        if (syncResult && syncResult.conflict) {
          // Double-booking conflict prevented!
          showToast(`⚠️ ${syncResult.message}`, 'warning', 4500);
          // Auto-suggest next open slot
          const nextSuggestion = CAMPUS_DATA.suggestBestSlot(destObj ? destObj.shortName : currentDestination);
          currentSlotId = nextSuggestion.slotId;
          activeSuggestedSlotId = nextSuggestion.slotId;
          renderVisualSlots();
          updateOverviewPanel();
          saveBtn.disabled = false;
          saveBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Save Parking Details & Get Pass</span>
          `;
          return;
        }
      }

      // 2. Persist to local pass and storage
      const savePayload = {
        destinationKey: currentDestination,
        destinationName: destObj.name,
        zoneKey: currentZoneKey,
        zoneTitle: `${zoneObj.title} (${zoneObj.subtitle})`,
        zoneLandmark: zoneObj.landmark,
        rowNumber: currentSlotId,
        walkingTime: destObj.walkingTimes[currentZoneKey] || '3 mins',
        milestones: milestones
      };

      const result = SmartParkStorage.save(savePayload);

      if (result.success) {
        const msg = isEditMode ? 'Parking spot updated successfully!' : `Parked in Bay ${currentSlotId}! Pass generated.`;
        showToast(msg, 'success', 2500);
        saveBtn.disabled = true;
        saveBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Saved! Opening Pass...</span>
        `;

        setTimeout(() => {
          window.location.href = isEditMode ? 'find.html' : 'saved.html';
        }, 800);
      } else {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Save Parking Details & Get Pass</span>
        `;
        showToast('Failed to save details. Please try again.', 'warning');
      }
    });
  }

  // Real-Time Cross-Device Sync Listener
  window.addEventListener('smartpark:slotsupdated', (e) => {
    // If the currently selected slot was just booked by another person on another phone
    const zoneInfo = CAMPUS_DATA.zones[currentZoneKey];
    if (zoneInfo && zoneInfo.slots) {
      const selectedSlot = zoneInfo.slots.find(s => s.id === currentSlotId);
      if (selectedSlot && selectedSlot.isBookedByOther) {
        showToast(`🔔 Notice: Bay ${currentSlotId} was just taken by another user. Selecting next available bay...`, 'warning', 3500);
        const nextSuggestion = CAMPUS_DATA.suggestBestSlot(CAMPUS_DATA.destinations[currentDestination]?.shortName);
        currentSlotId = nextSuggestion.slotId;
        activeSuggestedSlotId = nextSuggestion.slotId;
      }
    }

    // Refresh UI
    renderVisualSlots();
    updateOverviewPanel();

    // Refresh tab badges
    zoneTabBtns.forEach(btn => {
      const zKey = btn.dataset.zone;
      const z = CAMPUS_DATA.zones[zKey];
      if (z) {
        const badge = btn.querySelector('.tab-badge');
        if (badge) {
          badge.textContent = z.availableSpots > 0 ? `${z.availableSpots} Free` : 'FULL';
          badge.className = `tab-badge ${z.badgeClass}`;
        }
      }
    });
  });

  // Initial Boot
  setZone('B');
  updateDestination(currentDestination);
}

/* ==========================================================================
   Saved Location Page Controller (saved.html)
   ========================================================================== */
function initSavedPage() {
  const data = SmartParkStorage.get();

  const emptyContainer = document.getElementById('saved-empty-state');
  const detailsContainer = document.getElementById('saved-details-view');

  if (!data) {
    if (emptyContainer) emptyContainer.style.display = 'block';
    if (detailsContainer) detailsContainer.style.display = 'none';
    return;
  }

  if (emptyContainer) emptyContainer.style.display = 'none';
  if (detailsContainer) detailsContainer.style.display = 'block';

  document.getElementById('ticket-destination').textContent = data.destinationName;
  document.getElementById('ticket-zone').textContent = `Zone ${data.zoneKey}`;
  document.getElementById('ticket-row').textContent = data.rowNumber;
  document.getElementById('ticket-walking').textContent = data.walkingTime;
  document.getElementById('ticket-time').textContent = `${data.formattedDate} at ${data.formattedTime}`;
  
  if (data.zoneLandmark) {
    document.getElementById('ticket-hint').textContent = data.zoneLandmark;
  }

  const copyBtn = document.getElementById('btn-copy-ticket');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const summaryText = `SmartPark LPU Pass:\n📍 Destination: ${data.destinationName}\n🅿️ Zone: Zone ${data.zoneKey} (Row ${data.rowNumber})\n⏱️ Walking: ${data.walkingTime}`;
      navigator.clipboard.writeText(summaryText).then(() => {
        showToast('Parking pass copied to clipboard!', 'success');
      }).catch(() => {
        showToast('Could not copy to clipboard', 'warning');
      });
    });
  }

  showToast('Location saved successfully!', 'success', 3000);
}

/* ==========================================================================
   Find My Vehicle Page Controller (find.html)
   ========================================================================== */
function initFindPage() {
  const data = SmartParkStorage.get();

  const emptyView = document.getElementById('finder-empty-view');
  const activeView = document.getElementById('finder-active-view');

  if (!data) {
    if (emptyView) emptyView.style.display = 'block';
    if (activeView) activeView.style.display = 'none';
    return;
  }

  if (emptyView) emptyView.style.display = 'none';
  if (activeView) activeView.style.display = 'block';

  document.getElementById('find-dest-name').textContent = data.destinationName;
  document.getElementById('find-zone-name').textContent = `Zone ${data.zoneKey}`;
  document.getElementById('find-row-num').textContent = data.rowNumber;
  document.getElementById('find-walking-time').textContent = data.walkingTime;
  document.getElementById('find-saved-timestamp').textContent = `Parked at ${data.formattedTime}`;

  function updateDurationBadge() {
    const durationElem = document.getElementById('find-duration-badge');
    if (!durationElem || !data.timestamp) return;

    const parkedDate = new Date(data.timestamp);
    const now = new Date();
    const diffMs = Math.max(0, now - parkedDate);
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) {
      durationElem.textContent = 'Parked just now';
    } else if (diffMinutes === 1) {
      durationElem.textContent = 'Parked 1 min ago';
    } else if (diffMinutes < 60) {
      durationElem.textContent = `Parked ${diffMinutes} mins ago`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const remainingMins = diffMinutes % 60;
      durationElem.textContent = `Parked ${hours}h ${remainingMins}m ago`;
    }
  }

  updateDurationBadge();
  setInterval(updateDurationBadge, 30000);

  document.getElementById('map-start-dest').textContent = data.destinationName;
  document.getElementById('map-target-spot').textContent = `Zone ${data.zoneKey} (Row ${data.rowNumber})`;
  document.getElementById('map-walking-badge').textContent = data.walkingTime;

  const milestonesList = document.getElementById('find-milestones-list');
  if (milestonesList) {
    const steps = (data.milestones && data.milestones.length > 0)
      ? data.milestones
      : [
          `Start from ${data.destinationName} exit`,
          `Follow main campus walkway toward Zone ${data.zoneKey}`,
          `Arrive at Row ${data.rowNumber}`
        ];

    milestonesList.innerHTML = '';
    steps.forEach((stepText, idx) => {
      const li = document.createElement('li');
      li.className = 'milestone-item';
      li.title = 'Tap to check off as you walk';
      li.innerHTML = `
        <span class="milestone-num">${idx + 1}</span>
        <span>${stepText}</span>
      `;
      li.addEventListener('click', () => {
        li.classList.toggle('checked');
      });
      milestonesList.appendChild(li);
    });
  }

  const simulateBtn = document.getElementById('btn-simulate-route');
  const walkerPin = document.getElementById('sim-walker-pin');
  if (simulateBtn && walkerPin) {
    simulateBtn.addEventListener('click', () => {
      walkerPin.style.display = 'flex';
      walkerPin.style.left = '10%';
      walkerPin.style.transition = 'left 2.5s cubic-bezier(0.4, 0, 0.2, 1)';
      showToast('Simulating walking route to your vehicle...', 'success', 2500);

      setTimeout(() => {
        walkerPin.style.left = '85%';
      }, 50);

      setTimeout(() => {
        showToast(`You have arrived at Zone ${data.zoneKey}, Row ${data.rowNumber}! 🚗`, 'success', 3000);
      }, 2600);
    });
  }

  const shareBtn = document.getElementById('btn-share-location');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const shareText = `SmartPark LPU: I parked at ${data.destinationName}, Zone ${data.zoneKey}, Row ${data.rowNumber} (${data.walkingTime}).`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
          showToast('Copied parking details to clipboard!', 'success');
        });
      } else {
        alert(shareText);
      }
    });
  }

  const clearBtn = document.getElementById('btn-clear-vehicle');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Did you reach your vehicle? This will clear your saved parking slot.')) {
        SmartParkStorage.clear();
        showToast('Parking session completed! Safe travels.', 'success');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 750);
      }
    });
  }

  const updateBtn = document.getElementById('btn-update-location');
  if (updateBtn) {
    updateBtn.addEventListener('click', () => {
      window.location.href = 'index.html?edit=true';
    });
  }
}
