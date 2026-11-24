/**
 * SmartPark LPU - Live Shared Parking Slots API (Vercel Serverless Function)
 * Enables real-time cross-device synchronization across multiple phones & browsers.
 */

// In-memory cache across warm lambdas
let memoryBookings = {
  // Initially, default available slots in CAMPUS_DATA are unbooked.
  // Any dynamically booked slots from any device will be stored here.
};

// Master Persistent Cloud Object ID (CORS-enabled, zero-auth, high availability)
const CLOUD_MASTER_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a20d34f00c349b';

/**
 * Fetch latest bookings from cloud bucket with fallback to in-memory
 */
async function getCloudBookings() {
  try {
    if (typeof fetch === 'function') {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(CLOUD_MASTER_URL, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        if (json && json.data && typeof json.data === 'object') {
          memoryBookings = { ...json.data };
        }
      }
    }
  } catch (err) {
    // Cloud fetch timeout/fallback - use in-memory state
    console.warn('[SmartPark API] Cloud fetch failed, falling back to memory:', err.message);
  }
  return memoryBookings;
}

/**
 * Persist bookings to cloud bucket with fallback to in-memory
 */
async function saveCloudBookings(bookings) {
  memoryBookings = bookings;
  try {
    if (typeof fetch === 'function') {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      await fetch(CLOUD_MASTER_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: 'smartpark_lpu_master_v1',
          data: bookings
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    }
  } catch (err) {
    console.warn('[SmartPark API] Cloud save failed, keeping in memory:', err.message);
  }
}

export default async function handler(req, res) {
  // Enable CORS for all devices (mobile browsers, web apps, localhost)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Return all currently booked slots across the campus
  if (req.method === 'GET') {
    const bookings = await getCloudBookings();
    return res.status(200).json({
      success: true,
      bookedSlots: bookings,
      totalBooked: Object.keys(bookings).length,
      timestamp: new Date().toISOString()
    });
  }

  // POST: Book, Release, or Reset a slot
  if (req.method === 'POST') {
    let body = req.body || {};
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    const { action, slotId, zoneKey, vehicleNumber, vehicleModel, destination, deviceId, carColor } = body;

    const currentBookings = await getCloudBookings();

    if (action === 'book') {
      if (!slotId) {
        return res.status(400).json({ success: false, error: 'slotId is required' });
      }

      // Check if slot is already booked by another device
      const existing = currentBookings[slotId];
      if (existing && existing.deviceId && existing.deviceId !== deviceId) {
        return res.status(409).json({
          success: false,
          error: 'ALREADY_BOOKED',
          message: `Bay ${slotId} was just booked by vehicle ${existing.vehicleNumber || 'another user'}!`,
          currentBooking: existing
        });
      }

      // If this device already had another slot booked, release the previous one first
      if (deviceId) {
        for (const [sId, b] of Object.entries(currentBookings)) {
          if (b.deviceId === deviceId && sId !== slotId) {
            delete currentBookings[sId];
          }
        }
      }

      // Register new booking
      const newBooking = {
        slotId,
        zoneKey: zoneKey || (slotId.startsWith('B') ? 'B' : slotId.startsWith('C') ? 'C' : 'A'),
        vehicleNumber: vehicleNumber || 'PB-08-LP-2024',
        vehicleModel: vehicleModel || 'Swift Sedan',
        carColor: carColor || '#ef4444',
        destination: destination || 'Academic Block',
        deviceId: deviceId || 'anon_' + Math.random().toString(36).substring(2, 9),
        bookedAt: new Date().toISOString()
      };

      currentBookings[slotId] = newBooking;
      await saveCloudBookings(currentBookings);

      return res.status(200).json({
        success: true,
        message: `Bay ${slotId} booked successfully`,
        booking: newBooking,
        bookedSlots: currentBookings
      });
    }

    if (action === 'release') {
      if (slotId && currentBookings[slotId]) {
        delete currentBookings[slotId];
        await saveCloudBookings(currentBookings);
        return res.status(200).json({
          success: true,
          message: `Bay ${slotId} released`,
          bookedSlots: currentBookings
        });
      }

      // If deviceId provided, release any slot booked by this device
      if (deviceId) {
        let releasedId = null;
        for (const [sId, b] of Object.entries(currentBookings)) {
          if (b.deviceId === deviceId) {
            releasedId = sId;
            delete currentBookings[sId];
          }
        }
        await saveCloudBookings(currentBookings);
        return res.status(200).json({
          success: true,
          message: releasedId ? `Bay ${releasedId} released` : 'No active booking found',
          releasedId,
          bookedSlots: currentBookings
        });
      }

      return res.status(200).json({ success: true, bookedSlots: currentBookings });
    }

    if (action === 'reset') {
      await saveCloudBookings({});
      return res.status(200).json({ success: true, message: 'All bookings reset', bookedSlots: {} });
    }

    return res.status(400).json({ success: false, error: 'Invalid action. Use "book", "release", or "reset"' });
  }

  // DELETE: Release slot
  if (req.method === 'DELETE') {
    const { slotId } = req.query || {};
    const currentBookings = await getCloudBookings();
    if (slotId && currentBookings[slotId]) {
      delete currentBookings[slotId];
      await saveCloudBookings(currentBookings);
    }
    return res.status(200).json({ success: true, bookedSlots: currentBookings });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
