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
   * Smart Parking Recommendation Engine
   * Evaluates destination and available zone capacity to suggest optimal bay
   */
  suggestBestSlot: function(destinationShortName) {
    const dest = (destinationShortName || '').toLowerCase();
    
    if (dest.includes('mall') || dest.includes('unimall')) {
      // UniMall: Zone C has 3 spots, right next to Mall elevators!
      return {
        zoneKey: 'C',
        slotId: 'C-02',
        reason: 'Optimal for UniMall: Covered deck beside South Plaza elevators (~1 min walk)',
        distance: '90 meters',
        walkingTime: '1 min walk',
        features: ['☂️ Covered Deck', '⚡ EV Fast Charging', '🛗 Beside Mall Elevators']
      };
    } else if (dest.includes('library')) {
      // Central Library: Zone B has spots directly on shaded north pathway
      return {
        zoneKey: 'B',
        slotId: 'B-01',
        reason: 'Optimal for Central Library: Closest entrance via north shaded pathway (~2.5 mins)',
        distance: '190 meters',
        walkingTime: '2.5 mins walk',
        features: ['🛡️ CCTV Monitored', '⚡ EV Ready', '🚶 Shaded Walkway']
      };
    } else {
      // Academic Block / Default: Zone B - Bay B-04
      return {
        zoneKey: 'B',
        slotId: 'B-04',
        reason: 'Optimal for Academic Block: Directly adjacent to Block 36 South Courtyard (~2 mins)',
        distance: '150 meters',
        walkingTime: '2 mins walk',
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
      localStorage.removeItem(SMARTPARK_STORAGE_KEY);
      return true;
    } catch (e) {
      console.error('Error clearing parking data:', e);
      return false;
    }
  }
};

window.ThemeManager = ThemeManager;
window.CAMPUS_DATA = CAMPUS_DATA;
window.SmartParkStorage = SmartParkStorage;
