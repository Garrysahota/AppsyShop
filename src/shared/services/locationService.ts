import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({ id: 'appsyshop-location' });
const LAST_LOCATION_KEY = 'user_last_location_name';
const DEFAULT_FALLBACK_LOCATION = 'Bandra West, Mumbai';

try {
  if (typeof Geolocation.setRNConfiguration === 'function') {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
      locationProvider: 'auto',
    });
  }
} catch {}

export interface LocationData {
  city: string;
  region: string;
  country: string;
  formattedLocation: string;
  latitude?: number;
  longitude?: number;
  isFallback: boolean;
}

export interface DetailedAddressData {
  title: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  formattedLocation: string;
}

class LocationService {
  
  async requestPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'AppsyShop needs your location to show available sneaker drops and fast delivery near you.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('[Location] Permission request error:', err);
        return false;
      }
    } else {
      try {
        Geolocation.requestAuthorization();
        return true;
      } catch {
        return false;
      }
    }
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
        { headers: { Accept: 'application/json' } },
      );

      if (!response.ok) throw new Error('Geocoding service unavailable');

      const data = await response.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Downtown';
      const stateOrCountry =
        data.principalSubdivisionCode || data.countryCode || data.countryName || '';

      return stateOrCountry ? `${city}, ${stateOrCountry}` : city;
    } catch {
      try {
        const backupRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
          { headers: { 'User-Agent': 'AppsyShop/1.0' } },
        );
        const backupData = await backupRes.json();
        const address = backupData.address || {};
        const city =
          address.city || address.town || address.village || address.suburb || 'Downtown';
        const state = address.state || address.country || '';
        return state ? `${city}, ${state}` : city;
      } catch {
        return this.getLastSavedLocation();
      }
    }
  }

  async fetchIPLocation(): Promise<string> {
    try {
      const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client', {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        const city = data.city || data.locality || data.principalSubdivision;
        const region = data.principalSubdivisionCode || data.countryCode;
        if (city) {
          return region ? `${city}, ${region}` : city;
        }
      }
    } catch {}

    try {
      const res2 = await fetch('https://freeipapi.net/api/json');
      if (res2.ok) {
        const data2 = await res2.json();
        if (data2.cityName) {
          return data2.regionName
            ? `${data2.cityName}, ${data2.regionName}`
            : data2.cityName;
        }
      }
    } catch {}

    return this.getLastSavedLocation();
  }

  async detectUserCountry(): Promise<{ countryCode: string; countryName: string }> {
    try {
      const res = await fetch('https://freeipapi.net/api/json');
      if (res.ok) {
        const data = await res.json();
        return {
          countryCode: data.countryCode || 'IN',
          countryName: data.countryName || 'India',
        };
      }
    } catch {}
    return { countryCode: 'IN', countryName: 'India' };
  }

  async getDetailedAddress(): Promise<DetailedAddressData> {
    try {
      const hasPermission = await this.requestPermission();

      let latitude: number | undefined;
      let longitude: number | undefined;

      if (hasPermission) {
        try {
          const position: any = await new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
              pos => resolve(pos),
              err => reject(err),
              { enableHighAccuracy: false, timeout: 4500, maximumAge: 600000 },
            );
          });
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        } catch {
          
        }
      }

      if (latitude && longitude) {
        
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            { headers: { 'User-Agent': 'AppsyShop/1.0' } },
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const streetName =
              addr.road || addr.street || addr.pedestrian || addr.suburb || addr.neighbourhood || 'Current Location Street';
            const houseNumber = addr.house_number ? `${addr.house_number} ` : '';
            const city = addr.city || addr.town || addr.village || addr.municipality || 'New York';
            const state = addr.state || addr.state_district || 'NY';
            const zipCode = addr.postcode || '10001';
            const country = addr.country || 'USA';

            return {
              title: '📍 Current Location Drop',
              street: `${houseNumber}${streetName}`,
              city,
              state,
              zipCode,
              country,
              formattedLocation: `${city}, ${state}`,
            };
          }
        } catch {}

        try {
          const bdcRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );
          if (bdcRes.ok) {
            const bdcData = await bdcRes.json();
            const city = bdcData.city || bdcData.locality || 'New York';
            const state = bdcData.principalSubdivisionCode || bdcData.principalSubdivision || 'NY';
            const zipCode = bdcData.postcode || '10001';
            const street = bdcData.locality || `${city} Central Ave`;

            return {
              title: '📍 Current Location Drop',
              street,
              city,
              state,
              zipCode,
              country: bdcData.countryName || 'USA',
              formattedLocation: `${city}, ${state}`,
            };
          }
        } catch {}
      }

      const ipLoc = await this.fetchIPLocation();
      const parts = ipLoc.split(',');
      const city = parts[0]?.trim() || 'New York';
      const state = parts[1]?.trim() || 'NY';

      return {
        title: '📍 Current Location Drop',
        street: `${city} Central Blvd`,
        city,
        state,
        zipCode: '10001',
        country: 'USA',
        formattedLocation: ipLoc,
      };
    } catch {
      return {
        title: '📍 Current Location Drop',
        street: '742 Evergreen Terrace',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        formattedLocation: 'New York, NY',
      };
    }
  }

  async getCurrentLocation(): Promise<LocationData> {
    const hasPermission = await this.requestPermission();

    if (!hasPermission) {
      const fallbackLoc = await this.fetchIPLocation();
      this.saveLastLocation(fallbackLoc);

      return {
        city: fallbackLoc.split(',')[0].trim(),
        region: fallbackLoc.split(',')[1]?.trim() || '',
        country: '',
        formattedLocation: fallbackLoc,
        isFallback: true,
      };
    }

    return new Promise(resolve => {
      let resolved = false;

      const finish = (locStr: string, isFallback = false, lat?: number, lon?: number) => {
        if (resolved) return;
        resolved = true;
        this.saveLastLocation(locStr);
        resolve({
          city: locStr.split(',')[0].trim(),
          region: locStr.split(',')[1]?.trim() || '',
          country: '',
          formattedLocation: locStr,
          latitude: lat,
          longitude: lon,
          isFallback,
        });
      };

      Geolocation.getCurrentPosition(
        async position => {
          try {
            const { latitude, longitude } = position.coords;
            const formatted = await this.reverseGeocode(latitude, longitude);
            finish(formatted, false, latitude, longitude);
          } catch {
            const ipLoc = await this.fetchIPLocation();
            finish(ipLoc, false);
          }
        },
        async error => {
          console.log('[Location] Fast network GPS notice:', error.message);
          const ipLoc = await this.fetchIPLocation();
          finish(ipLoc, false);
        },
        { enableHighAccuracy: false, timeout: 4500, maximumAge: 600000 },
      );
    });
  }

  saveLastLocation(location: string): void {
    storage.set(LAST_LOCATION_KEY, location);
  }

  getLastSavedLocation(): string {
    return storage.getString(LAST_LOCATION_KEY) || DEFAULT_FALLBACK_LOCATION;
  }
}

export const locationService = new LocationService();
export default locationService;
