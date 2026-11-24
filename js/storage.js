/**
 * SmartPark LPU - Storage, Theme & Data Management Module
 * Clean Campus Parking Assistant
 */

const SMARTPARK_STORAGE_KEY = 'smartpark_lpu_active_parking';
const SMARTPARK_THEME_KEY = 'smartpark_lpu_theme';

/**
 * Theme Manager for Light and Dark Modes
 */
const ThemeManager = {
  getTheme: function() {
    const saved = localStorage.getItem(SMARTPARK_THEME_KEY);
    if (saved) return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  },

  setTheme: function(theme) {
    localStorage.setItem(SMARTPARK_THEME_KEY, theme);
    this.applyTheme(theme);
  },

  toggleTheme: function() {
    const current = this.getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
    return next;
  },

  applyTheme: function(theme) {
    const active = theme || this.getTheme();
    document.documentElement.setAttribute('data-theme', active);
    
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      if (active === 'dark') {
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        `;
        btn.setAttribute('title', 'Switch to Light Mode');
      } else {
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        `;
        btn.setAttribute('title', 'Switch to Dark Mode');
      }
    });
  }
};

ThemeManager.applyTheme();

/**
 * Simulated Campus Parking Data with Clear Availability & Landmarks
 */
const CAMPUS_DATA = {
  destinations: {
    academic: {
      id: 'academic',
      name: 'Academic Block (Blocks 34–38)',
      shortName: 'Academic Block',
      icon: '🏫',
      walkingTimes: {
        A: '2 mins walking (~140 m)',
        B: '4 mins walking (~290 m)',
        C: '6 mins walking (~450 m)'
      },
      milestones: {
        A: [
          'Exit Academic Block 34 North Entrance',
          'Take the direct paved walkway past the Faculty Gate',
          'Arrive at Zone A (North Gate Bay)'
        ],
        B: [
          'Exit Academic Block 36 South Courtyard',
          'Walk across Central Lawn towards Food Court plaza (~200m)',
          'Enter Zone B through West Gate and locate your designated row'
        ],
        C: [
          'Exit Academic Block 38 East Arcade',
          'Follow University Boulevard eastward towards UniMall perimeter (~380m)',
          'Enter Zone C parking entrance next to the UniMall delivery bay'
        ]
      }
    },
    library: {
      id: 'library',
      name: 'Central Library',
      shortName: 'Central Library',
      icon: '📚',
      walkingTimes: {
        A: '5 mins walking (~380 m)',
        B: '3 mins walking (~210 m)',
        C: '4 mins walking (~310 m)'
      },
      milestones: {
        A: [
          'Exit Central Library Main North Gate',
          'Head north past the Student Affairs Centre boulevard (~300m)',
          'Arrive at Zone A beside North Gate 1 security post'
        ],
        B: [
          'Exit Central Library South Pedestrian Ramp',
          'Follow the shaded walkway straight towards Block 36 (~180m)',
          'Enter Zone B Central Courtyard and find your row'
        ],
        C: [
          'Exit Central Library East Plaza',
          'Walk along cafeteria boulevard toward the UniMall roundabout (~260m)',
          'Enter Zone C parking deck'
        ]
      }
    },
    unimall: {
      id: 'unimall',
      name: 'University Mall (UniMall)',
      shortName: 'University Mall',
      icon: '🛍️',
      walkingTimes: {
        A: '7 mins walking (~520 m)',
        B: '5 mins walking (~370 m)',
        C: '2 mins walking (~150 m)'
      },
      milestones: {
        A: [
          'Exit UniMall Front Main Portico',
          'Take the campus shuttle avenue northbound past Central Library (~450m)',
          'Reach Zone A next to North Gate 1'
        ],
        B: [
          'Exit UniMall West Plaza',
          'Follow the central boulevard past the open amphitheatre (~300m)',
          'Turn into Zone B Central Courtyard entrance'
        ],
        C: [
          'Exit UniMall Rear Escalators / South Plaza',
          'Walk 100 meters directly into the Zone C perimeter parking deck',
          'Locate your designated bay'
        ]
      }
    }
  },

  zones: {
    A: {
      key: 'A',
      title: 'Zone A',
      subtitle: 'North Gate Parking Bay',
      landmark: 'Near Main Gate 1 & Security Gatehouse',
      status: 'FULL',
      statusType: 'full',
      totalSpots: 50,
      availableSpots: 0,
      occupiedPercent: 100,
      isSelectable: false,
      features: ['Covered Parking', '2-Wheelers Only', 'CCTV Monitored'],
      badgeClass: 'status-full',
      defaultWalking: '2 mins walking',
      baseAvailableSlotIds: [],
      slots: [
        { id: 'A-01', status: 'occupied', carModel: 'White Sedan', carColor: '#e2e8f0' },
        { id: 'A-02', status: 'occupied', carModel: 'Grey Hatchback', carColor: '#94a3b8' },
        { id: 'A-03', status: 'occupied', carModel: 'Black SUV', carColor: '#334155' },
        { id: 'A-04', status: 'occupied', carModel: 'Red Sedan', carColor: '#ef4444' },
        { id: 'A-05', status: 'occupied', carModel: 'Blue Crossover', carColor: '#3b82f6' },
        { id: 'A-06', status: 'occupied', carModel: 'Silver Sedan', carColor: '#cbd5e1' },
        { id: 'A-07', status: 'occupied', carModel: 'White Hatchback', carColor: '#f1f5f9' },
        { id: 'A-08', status: 'occupied', carModel: 'Dark Grey Sedan', carColor: '#475569' },
        { id: 'A-09', status: 'occupied', carModel: 'Maroon Compact', carColor: '#991b1b' },
        { id: 'A-10', status: 'occupied', carModel: 'Black Sedan', carColor: '#1e293b' },
        { id: 'A-11', status: 'occupied', carModel: 'Silver SUV', carColor: '#cbd5e1' },
        { id: 'A-12', status: 'occupied', carModel: 'White Crossover', carColor: '#f8fafc' }
      ]
    },
    B: {
      key: 'B',
      title: 'Zone B',
      subtitle: 'Central Courtyard Parking',
      landmark: 'Beside Block 36 Food Court & Central Lawns',
      status: 'AVAILABLE',
      statusType: 'available',
      totalSpots: 50,
      availableSpots: 24,
      occupiedPercent: 52,
      isSelectable: true,
      features: ['Open Air Bays', '2W & 4W Allowed', 'EV Charging Station'],
      badgeClass: 'status-available',
      defaultWalking: '4 mins walking',
      baseAvailableSlotIds: ['B-01', 'B-04', 'B-07', 'B-10', 'B-12'],
      slots: [
        { id: 'B-01', status: 'available', distance: '190m', walkingMin: 2.5, isCovered: false, hasEV: true },
        { id: 'B-02', status: 'occupied', carModel: 'Grey SUV', carColor: '#64748b' },
        { id: 'B-03', status: 'occupied', carModel: 'Maroon Sedan', carColor: '#991b1b' },
        { id: 'B-04', status: 'available', distance: '150m', walkingMin: 2.0, isCovered: true, hasEV: true, tag: 'BEST FOR ACADEMIC' },
        { id: 'B-05', status: 'occupied', carModel: 'Black Hatchback', carColor: '#1e293b' },
        { id: 'B-06', status: 'occupied', carModel: 'Blue Sedan', carColor: '#2563eb' },
        { id: 'B-07', status: 'available', distance: '210m', walkingMin: 3.0, isCovered: true, hasEV: false },
        { id: 'B-08', status: 'occupied', carModel: 'Silver Crossover', carColor: '#94a3b8' },
        { id: 'B-09', status: 'occupied', carModel: 'White Sedan', carColor: '#f8fafc' },
        { id: 'B-10', status: 'available', distance: '240m', walkingMin: 3.5, isCovered: false, hasEV: false },
        { id: 'B-11', status: 'occupied', carModel: 'Dark Grey SUV', carColor: '#334155' },
        { id: 'B-12', status: 'available', distance: '270m', walkingMin: 4.0, isCovered: false, hasEV: true }
      ]
    },
    C: {
      key: 'C',
      title: 'Zone C',
      subtitle: 'Mall Perimeter Parking Deck',
      landmark: 'Behind UniMall South Plaza Entrance',
      status: 'NEARLY FULL',
      statusType: 'nearly',
      totalSpots: 50,
      availableSpots: 3,
      occupiedPercent: 94,
      isSelectable: true,
      features: ['Covered Deck', '2W & 4W Allowed', 'Near Elevators'],
      badgeClass: 'status-nearly',
      defaultWalking: '6 mins walking',
      baseAvailableSlotIds: ['C-01', 'C-02', 'C-03'],
      slots: [
        { id: 'C-01', status: 'available', distance: '120m', walkingMin: 1.5, isCovered: true, hasEV: false },
        { id: 'C-02', status: 'available', distance: '90m', walkingMin: 1.0, isCovered: true, hasEV: true, tag: 'BEST FOR UNIMALL' },
        { id: 'C-03', status: 'available', distance: '140m', walkingMin: 2.0, isCovered: true, hasEV: false },
        { id: 'C-04', status: 'occupied', carModel: 'White Sedan', carColor: '#f1f5f9' },
        { id: 'C-05', status: 'occupied', carModel: 'Black SUV', carColor: '#0f172a' },
        { id: 'C-06', status: 'occupied', carModel: 'Silver Sedan', carColor: '#cbd5e1' },
        { id: 'C-07', status: 'occupied', carModel: 'Red Hatchback', carColor: '#dc2626' },
        { id: 'C-08', status: 'occupied', carModel: 'Grey Sedan', carColor: '#64748b' },
        { id: 'C-09', status: 'occupied', carModel: 'Maroon SUV', carColor: '#7f1d1d' },
        { id: 'C-10', status: 'occupied', carModel: 'Blue Sedan', carColor: '#1d4ed8' },
        { id: 'C-11', status: 'occupied', carModel: 'Black Crossover', carColor: '#18181b' },
        { id: 'C-12', status: 'occupied', carModel: 'White SUV', carColor: '#ffffff' }
      ]
    }
  },

  /**
   * Smart Parking Recommendation Engine (Availability-Aware)
   * Evaluates destination and LIVE available slots to always suggest an unoccupied bay
   */
  suggestBestSlot: function(destinationShortName) {
    const dest = (destinationShortName || '').toLowerCase();
    
    // Helper to find the first actually available slot in a zone
    const findAvailableInZone = (zoneKey, preferredSlotId) => {
      const zone = this.zones[zoneKey];
      if (!zone || !zone.slots) return null;
      if (preferredSlotId) {
        const pref = zone.slots.find(s => s.id === preferredSlotId && s.status === 'available');
        if (pref) return pref;
      }
      return zone.slots.find(s => s.status === 'available') || null;
    };

    if (dest.includes('mall') || dest.includes('unimall')) {
      // UniMall: Preferred Zone C (C-02)
      let slot = findAvailableInZone('C', 'C-02');
      let zoneKey = 'C';
      if (!slot) {
        // Zone C full, fall back to closest open slot in Zone B
        slot = findAvailableInZone('B', 'B-04');
        zoneKey = 'B';
      }
      return {
        zoneKey: zoneKey,
        slotId: slot ? slot.id : 'C-02',
        reason: zoneKey === 'C'
          ? `Optimal for UniMall: Bay ${slot ? slot.id : 'C-02'} beside South Plaza elevators (~1 min walk)`
          : `UniMall Deck occupied: Closest open bay is ${slot ? slot.id : 'B-04'} in Zone B Central Courtyard`,
        distance: slot && slot.distance ? slot.distance : '90 meters',
        walkingTime: slot && slot.walkingMin ? `${slot.walkingMin} mins walk` : '1 min walk',
        features: ['☂️ Covered Deck', '⚡ EV Fast Charging', '🛗 Beside Mall Elevators']
      };
    } else if (dest.includes('library')) {
      // Central Library: Preferred Zone B (B-01)
      let slot = findAvailableInZone('B', 'B-01');
      let zoneKey = 'B';
      if (!slot) {
        slot = findAvailableInZone('C', 'C-01');
        zoneKey = 'C';
      }
      return {
        zoneKey: zoneKey,
        slotId: slot ? slot.id : 'B-01',
        reason: zoneKey === 'B'
          ? `Optimal for Central Library: Bay ${slot ? slot.id : 'B-01'} via north shaded pathway (~2.5 mins)`
          : `Central Library bays full: Closest open bay is ${slot ? slot.id : 'C-01'} in Zone C`,
        distance: slot && slot.distance ? slot.distance : '190 meters',
        walkingTime: slot && slot.walkingMin ? `${slot.walkingMin} mins walk` : '2.5 mins walk',
        features: ['🛡️ CCTV Monitored', '⚡ EV Ready', '🚶 Shaded Walkway']
      };
    } else {
      // Academic Block / Default: Preferred Zone B (B-04)
      let slot = findAvailableInZone('B', 'B-04');
      let zoneKey = 'B';
      if (!slot) {
        slot = findAvailableInZone('C', 'C-01');
        zoneKey = 'C';
      }
      return {
        zoneKey: zoneKey,
        slotId: slot ? slot.id : 'B-04',
        reason: zoneKey === 'B'
          ? `Optimal for Academic Block: Bay ${slot ? slot.id : 'B-04'} adjacent to Block 36 South Courtyard (~2 mins)`
          : `Zone B fully booked: Nearest available open bay is ${slot ? slot.id : 'C-01'} in Zone C`,
        distance: slot && slot.distance ? slot.distance : '150 meters',
        walkingTime: slot && slot.walkingMin ? `${slot.walkingMin} mins walk` : '2 mins walk',
        features: ['☂️ Shaded Bay', '⚡ EV Ready', '🛡️ CCTV Monitored']
      };
    }
  }
};

/**
 * Storage Service for saving and updating parking records
 */
const SmartParkStorage = {
  save: function(data) {
    try {
      const now = new Date();
      // If updating, preserve original parked timestamp if available
      const existing = this.get();
      const isUpdate = existing && existing.rowNumber;
      
      const payload = {
        destinationKey: data.destinationKey,
        destinationName: data.destinationName,
        zoneKey: data.zoneKey,
        zoneTitle: data.zoneTitle,
        zoneLandmark: data.zoneLandmark || '',
        rowNumber: data.rowNumber,
        vehicleType: data.vehicleType || 'Two Wheeler',
        vehicleNumber: data.vehicleNumber || '',
        walkingTime: data.walkingTime || '',
        milestones: data.milestones || [],
        timestamp: (isUpdate && existing.timestamp) ? existing.timestamp : now.toISOString(),
        lastUpdated: now.toISOString(),
        formattedDate: now.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        formattedTime: now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };
      localStorage.setItem(SMARTPARK_STORAGE_KEY, JSON.stringify(payload));
      return { success: true, data: payload, isUpdate: isUpdate };
    } catch (e) {
      console.error('Error saving parking location:', e);
      return { success: false, error: e.message };
    }
  },

  get: function() {
    try {
      const item = localStorage.getItem(SMARTPARK_STORAGE_KEY);
      if (!item) return null;
      return JSON.parse(item);
    } catch (e) {
      console.error('Error reading parking details:', e);
      return null;
    }
  },

  hasSavedLocation: function() {
    return this.get() !== null;
  },

  clear: function() {
    try {
      const existing = this.get();
      if (existing && existing.rowNumber && window.SmartParkSync) {
        window.SmartParkSync.releaseSlot(existing.rowNumber);
      }
      localStorage.removeItem(SMARTPARK_STORAGE_KEY);
      return true;
    } catch (e) {
      console.error('Error clearing parking data:', e);
      return false;
    }
  }
};

/**
 * SmartParkSync - Real-Time Cross-Device Parking Synchronizer
 * Synchronizes slot occupancy across multiple phones and devices via Vercel Serverless & Cloud Master Store
 */
const SmartParkSync = {
  _deviceIdKey: 'smartpark_lpu_device_id',
  _syncTimer: null,
  _eventsBound: false,
  _cloudMasterUrl: 'https://api.restful-api.dev/objects/ff808181a09d98f701a20d34f00c349b',

  getDeviceId: function() {
    try {
      let id = localStorage.getItem(this._deviceIdKey);
      if (!id) {
        id = 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
        localStorage.setItem(this._deviceIdKey, id);
      }
      return id;
    } catch (e) {
      return 'dev_' + Math.random().toString(36).substring(2, 10);
    }
  },

  /**
   * Fetch current campus bookings from Vercel Serverless API or direct Master Cloud fallback
   */
  fetchLiveSlots: async function() {
    // 1. Attempt Vercel Serverless API first
    try {
      const res = await fetch('/api/slots', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store', 'Pragma': 'no-cache' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json && typeof json.bookedSlots === 'object') {
          this.applyBookingsToCampusData(json.bookedSlots);
          return json.bookedSlots;
        }
      }
    } catch (err) {
      // Serverless API endpoint not active in static preview; proceed to fallback
    }

    // 2. Direct Master Cloud Store Fallback
    try {
      const res = await fetch(this._cloudMasterUrl, {
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        const bookings = (json && json.data && typeof json.data === 'object') ? json.data : {};
        this.applyBookingsToCampusData(bookings);
        return bookings;
      }
    } catch (err) {
      console.warn('[SmartParkSync] Background sync unreachable:', err.message);
    }
    return null;
  },

  /**
   * Applies live cloud bookings to CAMPUS_DATA.zones and notifies UI
   */
  applyBookingsToCampusData: function(bookedSlots = {}) {
    const myDeviceId = this.getDeviceId();
    const activeSaved = SmartParkStorage.get();
    const mySavedSlot = activeSaved ? activeSaved.rowNumber : null;

    ['A', 'B', 'C'].forEach(zoneKey => {
      const zone = CAMPUS_DATA.zones[zoneKey];
      if (!zone || !zone.slots) return;

      zone.slots.forEach(slot => {
        const booking = bookedSlots[slot.id];
        if (booking) {
          // Slot is occupied in the live system
          slot.status = 'occupied';
          slot.bookedBy = booking.deviceId;
          slot.isBookedByMe = (booking.deviceId === myDeviceId) || (slot.id === mySavedSlot);
          slot.isBookedByOther = !slot.isBookedByMe;
          slot.vehicleNumber = booking.vehicleNumber || '';
          slot.carModel = slot.isBookedByMe
            ? 'YOUR VEHICLE'
            : (booking.vehicleModel || (booking.vehicleNumber ? `Car (${booking.vehicleNumber})` : 'Occupied Car'));
          slot.carColor = slot.isBookedByMe
            ? '#38bdf8'
            : (booking.carColor || '#ef4444');
        } else if (zone.baseAvailableSlotIds && zone.baseAvailableSlotIds.includes(slot.id)) {
          // Vacant open bay
          slot.status = 'available';
          slot.isBookedByMe = false;
          slot.isBookedByOther = false;
          slot.vehicleNumber = null;
          slot.bookedBy = null;
        }
      });

      // Dynamically compute live counts
      const availableCount = zone.slots.filter(s => s.status === 'available').length;
      zone.availableSpots = availableCount;
      zone.occupiedPercent = Math.round(((zone.slots.length - availableCount) / zone.slots.length) * 100);

      if (availableCount === 0) {
        zone.status = 'FULL';
        zone.statusType = 'full';
        zone.badgeClass = 'status-full';
        zone.isSelectable = false;
      } else if (availableCount <= 2) {
        zone.status = 'NEARLY FULL';
        zone.statusType = 'nearly';
        zone.badgeClass = 'status-nearly';
        zone.isSelectable = true;
      } else {
        zone.status = 'AVAILABLE';
        zone.statusType = 'available';
        zone.badgeClass = 'status-available';
        zone.isSelectable = true;
      }
    });

    // Fire window event to update visual matrix in real-time
    window.dispatchEvent(new CustomEvent('smartpark:slotsupdated', {
      detail: { bookedSlots: bookedSlots, deviceId: myDeviceId }
    }));
  },

  /**
   * Book a slot across all campus devices with race-condition detection
   */
  bookSlot: async function(slotData) {
    const deviceId = this.getDeviceId();
    const payload = {
      action: 'book',
      slotId: slotData.slotId,
      zoneKey: slotData.zoneKey,
      vehicleNumber: slotData.vehicleNumber || 'PB-08-LP-2024',
      vehicleModel: slotData.vehicleModel || 'Swift Sedan',
      carColor: slotData.carColor || '#38bdf8',
      destination: slotData.destination || 'Campus Destination',
      deviceId: deviceId
    };

    // 1. Try Vercel Serverless API
    try {
      const res = await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (res.status === 409 || (json && json.error === 'ALREADY_BOOKED')) {
        return {
          success: false,
          conflict: true,
          message: json.message || `Bay ${slotData.slotId} is already booked by another vehicle!`
        };
      }
      if (res.ok && json.success) {
        if (json.bookedSlots) this.applyBookingsToCampusData(json.bookedSlots);
        return { success: true, booking: json.booking };
      }
    } catch (err) {
      // Serverless not available, fallback to direct cloud store
    }

    // 2. Direct Cloud Fallback
    try {
      const getRes = await fetch(this._cloudMasterUrl);
      const getJson = await getRes.json();
      const currentBookings = (getJson && getJson.data && typeof getJson.data === 'object') ? { ...getJson.data } : {};

      // Double-booking check
      const existing = currentBookings[slotData.slotId];
      if (existing && existing.deviceId && existing.deviceId !== deviceId) {
        return {
          success: false,
          conflict: true,
          message: `Bay ${slotData.slotId} is already occupied by vehicle ${existing.vehicleNumber || 'another user'}!`
        };
      }

      // Clear previous slot for this device
      for (const [sId, b] of Object.entries(currentBookings)) {
        if (b.deviceId === deviceId && sId !== slotData.slotId) {
          delete currentBookings[sId];
        }
      }

      currentBookings[slotData.slotId] = {
        slotId: slotData.slotId,
        zoneKey: slotData.zoneKey,
        vehicleNumber: payload.vehicleNumber,
        vehicleModel: payload.vehicleModel,
        carColor: payload.carColor,
        destination: payload.destination,
        deviceId: deviceId,
        bookedAt: new Date().toISOString()
      };

      await fetch(this._cloudMasterUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'smartpark_lpu_master_v1',
          data: currentBookings
        })
      });

      this.applyBookingsToCampusData(currentBookings);
      return { success: true, booking: currentBookings[slotData.slotId] };
    } catch (err) {
      console.warn('[SmartParkSync] Cloud booking failed, operating locally:', err.message);
      return { success: true, offline: true };
    }
  },

  /**
   * Release a slot when driver departs or clears session
   */
  releaseSlot: async function(slotId) {
    const deviceId = this.getDeviceId();
    const payload = { action: 'release', slotId: slotId, deviceId: deviceId };

    try {
      await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      // Direct cloud release fallback
      try {
        const getRes = await fetch(this._cloudMasterUrl);
        const getJson = await getRes.json();
        const currentBookings = (getJson && getJson.data && typeof getJson.data === 'object') ? { ...getJson.data } : {};
        if (slotId && currentBookings[slotId]) delete currentBookings[slotId];
        for (const [sId, b] of Object.entries(currentBookings)) {
          if (b.deviceId === deviceId) delete currentBookings[sId];
        }
        await fetch(this._cloudMasterUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'smartpark_lpu_master_v1',
            data: currentBookings
          })
        });
        this.applyBookingsToCampusData(currentBookings);
      } catch (err) {}
    }
  },

  /**
   * Start auto-polling (every 3.5s) and attach window focus / visibility triggers
   */
  startAutoSync: function(intervalMs = 3500) {
    this.fetchLiveSlots();

    if (this._syncTimer) clearInterval(this._syncTimer);
    this._syncTimer = setInterval(() => {
      this.fetchLiveSlots();
    }, intervalMs);

    if (!this._eventsBound) {
      this._eventsBound = true;
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          this.fetchLiveSlots();
        }
      });
      window.addEventListener('focus', () => {
        this.fetchLiveSlots();
      });
    }
  }
};

window.ThemeManager = ThemeManager;
window.CAMPUS_DATA = CAMPUS_DATA;
window.SmartParkStorage = SmartParkStorage;
window.SmartParkSync = SmartParkSync;

// Immediately initiate background synchronization across devices
SmartParkSync.startAutoSync();
