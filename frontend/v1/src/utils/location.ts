export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  source: 'gps' | 'ip';
}

export async function getCurrentLocation(): Promise<LocationData> {
  // Try GPS first
  if ("geolocation" in navigator) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        source: 'gps'
      };
    } catch (error) {
      console.warn("GPS failed, falling back to IP:", error);
    }
  }

  // Fallback to IP-based location
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      source: 'ip'
    };
  } catch (error) {
    console.error("IP Geoloc failed:", error);
    throw new Error("Could not determine location");
  }
}
