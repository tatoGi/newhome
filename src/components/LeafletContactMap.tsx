'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { LocateFixed, MapPinned } from 'lucide-react';

type LeafletModule = typeof import('leaflet');

interface LeafletContactMapProps {
  address?: string;
  title?: string;
}

const DEFAULT_CENTER: [number, number] = [41.7151, 44.8271];

function stripHtml(value: string): string {
  if (typeof window === 'undefined') {
    return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(value, 'text/html');
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default function LeafletContactMap({ address = '', title = 'Location' }: LeafletContactMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import('leaflet').Map | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const addressMarkerRef = useRef<import('leaflet').Marker | null>(null);
  const userMarkerRef = useRef<import('leaflet').Marker | null>(null);

  const [mapReady, setMapReady] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [geocodeError, setGeocodeError] = useState('');
  const [locationError, setLocationError] = useState('');

  const normalizedAddress = stripHtml(address);

  useEffect(() => {
    let isCancelled = false;

    const initMap = async () => {
      if (mapRef.current || !mapContainerRef.current) {
        return;
      }

      const L = await import('leaflet');
      if (isCancelled || !mapContainerRef.current) {
        return;
      }

      leafletRef.current = L;

      const map = L.map(mapContainerRef.current, {
        center: DEFAULT_CENTER,
        zoom: 12,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      const addressMarker = L.marker(DEFAULT_CENTER, {
        icon: L.divIcon({
          className: 'contact-map-pin',
          html: '<span class="contact-map-pin__inner"></span>',
          iconSize: [26, 26],
          iconAnchor: [13, 26],
          popupAnchor: [0, -24],
        }),
      }).addTo(map);

      addressMarker.bindPopup(escapeHtml(title));

      mapRef.current = map;
      addressMarkerRef.current = addressMarker;
      setMapReady(true);

      // Dynamic mount after layout paint can leave Leaflet with stale dimensions.
      window.requestAnimationFrame(() => {
        map.invalidateSize();
      });
    };

    void initMap();

    return () => {
      isCancelled = true;
      userMarkerRef.current = null;
      addressMarkerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
      leafletRef.current = null;
      setMapReady(false);
    };
  }, [title]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !addressMarkerRef.current) {
      return;
    }

    if (normalizedAddress === '') {
      const addressMarker = addressMarkerRef.current;

      if (addressMarker) {
        addressMarker
          .setLatLng(DEFAULT_CENTER)
          .bindPopup(escapeHtml(title))
          .openPopup();
      }

      mapRef.current.setView(DEFAULT_CENTER, 12);
      return;
    }

    const controller = new AbortController();

    const geocodeAddress = async () => {
      try {
        setIsGeocoding(true);
        setGeocodeError('');

        const locale = document.documentElement.lang || 'ka';
        const params = new URLSearchParams({
          q: normalizedAddress,
          format: 'jsonv2',
          limit: '1',
          'accept-language': locale,
          countrycodes: 'ge',
        });

        const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to geocode address.');
        }

        const results = (await response.json()) as Array<{ lat: string; lon: string }>;
        const firstResult = results[0];

        if (!firstResult) {
          throw new Error('Address not found.');
        }

        const coords: [number, number] = [Number(firstResult.lat), Number(firstResult.lon)];
        const popupHtml = `<strong>${escapeHtml(title)}</strong><br/>${escapeHtml(normalizedAddress)}`;
        const addressMarker = addressMarkerRef.current;

        if (addressMarker) {
          addressMarker
            .setLatLng(coords)
            .bindPopup(popupHtml)
            .openPopup();
        }

        mapRef.current?.flyTo(coords, 15, { duration: 1.2 });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setGeocodeError('მისამართის ავტომატურად პოვნა ვერ მოხერხდა. ნაგულისხმევი რუკა ჩაიტვირთა.');

        const addressMarker = addressMarkerRef.current;

        if (addressMarker) {
          addressMarker
            .setLatLng(DEFAULT_CENTER)
            .bindPopup(`<strong>${escapeHtml(title)}</strong><br/>${escapeHtml(normalizedAddress)}`);
        }

        mapRef.current?.setView(DEFAULT_CENTER, 12);
      } finally {
        if (!controller.signal.aborted) {
          setIsGeocoding(false);
        }
      }
    };

    void geocodeAddress();

    return () => controller.abort();
  }, [mapReady, normalizedAddress, title]);

  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapRef.current || !leafletRef.current) {
      setLocationError('თქვენს ბრაუზერში geolocation ხელმისაწვდომი არ არის.');
      return;
    }

    setIsLocating(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        const L = leafletRef.current;

        if (!L || !mapRef.current) {
          setIsLocating(false);
          return;
        }

        if (!userMarkerRef.current) {
          userMarkerRef.current = L.marker(coords, {
            icon: L.divIcon({
              className: 'contact-map-user-pin',
              html: '<span class="contact-map-user-pin__inner"></span>',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
          }).addTo(mapRef.current);
        } else {
          userMarkerRef.current.setLatLng(coords);
        }

        userMarkerRef.current.bindPopup('თქვენი მიმდინარე მდებარეობა');
        mapRef.current.flyTo(coords, 14, { duration: 1 });
        userMarkerRef.current.openPopup();
        setIsLocating(false);
      },
      () => {
        setLocationError('მიმდინარე მდებარეობის მიღებაზე წვდომა ვერ მოხერხდა.');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  return (
    <div className="contact-map-shell">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <MapPinned size={20} />
            <span>ჩვენი ლოკაცია</span>
          </h3>
          <p className="text-muted small mb-0">
            Leaflet + OpenStreetMap რუკა, მისამართის უფასო geocoding-ით.
          </p>
        </div>
        <Button variant="outline-primary" onClick={handleLocateMe} disabled={isLocating}>
          {isLocating ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              ლოკაცია...
            </>
          ) : (
            <>
              <LocateFixed size={16} className="me-2" />
              ჩემი მდებარეობა
            </>
          )}
        </Button>
      </div>

      {(isGeocoding || geocodeError || locationError) ? (
        <div className="d-flex flex-column gap-1 mb-3">
          {isGeocoding ? <div className="small text-muted">მისამართი რუკაზე იტვირთება...</div> : null}
          {geocodeError ? <div className="small text-warning">{geocodeError}</div> : null}
          {locationError ? <div className="small text-warning">{locationError}</div> : null}
        </div>
      ) : null}

      <div ref={mapContainerRef} className="contact-leaflet-map" />
    </div>
  );
}
