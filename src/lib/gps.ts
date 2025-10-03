/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Check if movement is significant enough to count (> 5 meters)
 */
export function isSignificantMovement(distanceKm: number): boolean {
  return distanceKm > 0.005; // 5 meters
}

/**
 * Check if GPS accuracy is good enough (< 50 meters)
 */
export function isGoodAccuracy(accuracy: number): boolean {
  return accuracy < 50;
}

/**
 * Request GPS permission and get current position
 */
export async function requestGPSPermission(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation não é suportado neste dispositivo'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => {
        let message = 'Erro ao acessar localização';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Permissão de localização negada. Por favor, habilite nas configurações.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Localização indisponível. Verifique se o GPS está ativado.';
            break;
          case error.TIMEOUT:
            message = 'Tempo esgotado ao tentar obter localização.';
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

/**
 * Watch GPS position continuously
 */
export function watchGPSPosition(
  onPosition: (position: GeolocationPosition) => void,
  onError: (error: string) => void
): number {
  if (!navigator.geolocation) {
    onError('Geolocation não é suportado neste dispositivo');
    return -1;
  }

  return navigator.geolocation.watchPosition(
    onPosition,
    (error) => {
      let message = 'Erro ao rastrear localização';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = 'Permissão de localização negada';
          break;
        case error.POSITION_UNAVAILABLE:
          message = 'Localização indisponível';
          break;
        case error.TIMEOUT:
          message = 'Timeout ao rastrear localização';
          break;
      }
      onError(message);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  );
}
