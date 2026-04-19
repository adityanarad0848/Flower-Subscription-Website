import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, MapPin, Navigation, Check, X } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "@/app/context/auth";

const SERVICEABLE_AREAS = [
  { name: "Wagholi",      lat: 18.5793, lng: 73.9865, radius: 5 },
  { name: "Kharadi",      lat: 18.5515, lng: 73.9474, radius: 5 },
  { name: "Chandan Nagar",lat: 18.5362, lng: 73.8797, radius: 5 },
  { name: "Viman Nagar",  lat: 18.5679, lng: 73.9143, radius: 5 },
  { name: "Hadapsar",     lat: 18.5089, lng: 73.9260, radius: 5 },
];

const DEFAULT_CENTER = { lat: 18.5679, lng: 73.9143 }; // Viman Nagar

function calcDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isServiceable(lat: number, lng: number) {
  return SERVICEABLE_AREAS.some(a => calcDistance(lat, lng, a.lat, a.lng) <= a.radius);
}

export default function AddressMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const fromCheckout = searchParams.get('from') === 'checkout';
  const editAddressId = searchParams.get('edit');

  const [mapsReady, setMapsReady] = useState(false);
  const [pin, setPin] = useState(DEFAULT_CENTER);
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [serviceable, setServiceable] = useState<boolean | null>(null);
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [customLabel, setCustomLabel] = useState('');
  const [floor, setFloor] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  // Load Google Maps
  useEffect(() => {
    const initMap = () => setMapsReady(true);
    if ((window as any).google?.maps) { initMap(); return; }
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    // If script already injected, wait for it
    const existing = document.querySelector('script[data-gmap]') as HTMLScriptElement | null;
    if (existing) {
      if ((window as any).google?.maps) { initMap(); }
      else existing.addEventListener('load', initMap);
      return;
    }
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    s.async = true;
    s.setAttribute('data-gmap', '1');
    s.onload = initMap;
    document.head.appendChild(s);
  }, []);

  // Init map once ready
  useEffect(() => {
    if (!mapsReady || !mapRef.current) return;
    const google = (window as any).google;

    // Load existing address if editing
    if (editAddressId && user) {
      loadExistingAddress();
    }

    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: pin,
      zoom: 16,
      disableDefaultUI: true,
      zoomControl: true,
      styles: [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }],
    });

    markerRef.current = new google.maps.Marker({
      position: pin,
      map: mapInstance.current,
      draggable: true,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#F97316',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 3,
      },
    });

    // Draw serviceable area circles
    SERVICEABLE_AREAS.forEach(area => {
      new google.maps.Circle({
        map: mapInstance.current,
        center: { lat: area.lat, lng: area.lng },
        radius: area.radius * 1000,
        strokeColor: '#10B981',
        strokeOpacity: 0.5,
        strokeWeight: 1.5,
        fillColor: '#10B981',
        fillOpacity: 0.08,
      });
    });

    markerRef.current.addListener('dragend', () => {
      const pos = markerRef.current.getPosition();
      const newPin = { lat: pos.lat(), lng: pos.lng() };
      setPin(newPin);
      reverseGeocode(newPin);
    });

    // Also allow tapping map to move pin
    mapInstance.current.addListener('click', (e: any) => {
      const newPin = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      markerRef.current.setPosition(newPin);
      setPin(newPin);
      reverseGeocode(newPin);
    });

    // Force resize so map fills container correctly
    setTimeout(() => {
      google.maps.event.trigger(mapInstance.current, 'resize');
      mapInstance.current.setCenter(pin);
    }, 100);

    // If opened from search suggestion, center on that location
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const placeId = searchParams.get('place_id');

    if (placeId) {
      const service = new google.maps.places.PlacesService(mapInstance.current);
      service.getDetails({ placeId, fields: ['geometry', 'formatted_address', 'address_components'] }, (place: any, status: string) => {
        if (status === 'OK' && place.geometry?.location) {
          const newPin = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
          setPin(newPin);
          mapInstance.current.panTo(newPin);
          mapInstance.current.setZoom(17);
          markerRef.current.setPosition(newPin);
          reverseGeocode(newPin);
        }
      });
    } else if (lat && lng) {
      const newPin = { lat: parseFloat(lat), lng: parseFloat(lng) };
      setPin(newPin);
      setTimeout(() => {
        mapInstance.current?.panTo(newPin);
        mapInstance.current?.setZoom(17);
        markerRef.current?.setPosition(newPin);
        reverseGeocode(newPin);
      }, 150);
    } else {
      reverseGeocode(pin);
    }
  }, [mapsReady]);

  const loadExistingAddress = async () => {
    if (!user || !editAddressId) return;
    
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('id', editAddressId)
      .eq('user_id', user.id)
      .single();
    
    if (data && !error) {
      setName(data.name || '');
      setPhone(data.phone || '');
      setFloor(data.address_line2 || '');
      setLabel(data.name === 'Home' || data.name === 'Work' ? data.name : 'Other');
      if (data.name !== 'Home' && data.name !== 'Work') {
        setCustomLabel(data.name);
      }
      
      if (data.latitude && data.longitude) {
        const newPin = { lat: data.latitude, lng: data.longitude };
        setPin(newPin);
        setTimeout(() => {
          mapInstance.current?.panTo(newPin);
          mapInstance.current?.setZoom(17);
          markerRef.current?.setPosition(newPin);
          reverseGeocode(newPin);
        }, 150);
      }
    }
  };

  const reverseGeocode = (coords: { lat: number; lng: number }) => {
    const google = (window as any).google;
    if (!google) return;
    setServiceable(isServiceable(coords.lat, coords.lng));
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: coords }, (results: any, status: any) => {
      if (status === 'OK' && results?.[0]) {
        setAddress(results[0].formatted_address ?? '');
        const pc = results[0].address_components?.find((c: any) => c.types.includes('postal_code'));
        setPincode(pc?.long_name ?? '');
      }
    });
  };

  const goToMyLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPin = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPin(newPin);
        mapInstance.current?.panTo(newPin);
        mapInstance.current?.setZoom(17);
        markerRef.current?.setPosition(newPin);
        reverseGeocode(newPin);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSave = async () => {
    if (!user || saving) return;
    
    // Validate required fields
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (!phone.trim() || phone.length < 10) {
      alert('Please enter a valid phone number (at least 10 digits)');
      return;
    }
    
    setSaving(true);
    const finalName = label === 'Other' ? (customLabel || 'Other') : label;
    const resolvedAddress = address || `Near ${SERVICEABLE_AREAS.reduce((closest, area) => {
      const d = calcDistance(pin.lat, pin.lng, area.lat, area.lng);
      return d < calcDistance(pin.lat, pin.lng, closest.lat, closest.lng) ? area : closest;
    }, SERVICEABLE_AREAS[0]).name}, Pune`;

    if (editAddressId) {
      // Update existing address
      const { error } = await supabase
        .from('user_addresses')
        .update({
          name: finalName,
          phone: phone,
          address_line1: resolvedAddress,
          address_line2: floor || null,
          city: 'Pune',
          state: 'Maharashtra',
          pincode: pincode || null,
          latitude: pin.lat,
          longitude: pin.lng,
          is_serviceable: serviceable ?? false,
        })
        .eq('id', editAddressId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Update error:', error);
        alert(`Could not update: ${error.message}`);
        setSaving(false);
        return;
      }
    } else {
      // Insert new address
      const { data: existing, error: fetchErr } = await supabase
        .from('user_addresses')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (fetchErr) {
        console.error('Fetch error:', fetchErr);
        alert('Could not save address. Please try again.');
        setSaving(false);
        return;
      }

      const isFirst = !existing || existing.length === 0;
      const { error } = await supabase.from('user_addresses').insert({
        user_id: user.id,
        name: finalName,
        phone: phone,
        address_line1: resolvedAddress,
        address_line2: floor || null,
        city: 'Pune',
        state: 'Maharashtra',
        pincode: pincode || null,
        latitude: pin.lat,
        longitude: pin.lng,
        is_default: isFirst,
        is_serviceable: serviceable ?? false,
      });

      if (error) {
        console.error('Insert error:', error);
        alert(`Could not save: ${error.message}`);
        setSaving(false);
        return;
      }
    }
    
    setSaving(false);
    if (fromCheckout) {
      navigate('/checkout');
    } else {
      navigate('/select-location');
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-gray-100 flex items-center gap-3 px-4 h-14 z-10">
        <button onClick={() => fromCheckout ? navigate('/checkout') : navigate(-1)} className="p-1 -ml-1">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-base font-bold text-gray-900">Set Delivery Location</h1>
      </div>

      {/* Map */}
      <div className="relative" style={{ flex: '1 1 0', minHeight: 0 }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

        {/* Loading overlay */}
        {!mapsReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 gap-2">
            <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Loading map...</p>
          </div>
        )}

        {/* GPS button */}
        <button
          onClick={goToMyLocation}
          className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 z-10"
        >
          <Navigation className={`w-5 h-5 text-blue-500 ${locating ? 'animate-pulse' : ''}`} />
        </button>

        {/* Serviceability badge */}
        {serviceable !== null && (
          <div className={`absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow z-10 ${
            serviceable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {serviceable ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
            {serviceable ? 'Delivery available here' : 'Outside delivery zone'}
          </div>
        )}

        {/* Drag hint */}
        {mapsReady && serviceable === null && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full z-10">
            Tap or drag pin to set location
          </div>
        )}
      </div>

      {/* Bottom sheet */}
      <div className="shrink-0 bg-white rounded-t-2xl shadow-xl px-4 pt-3 pb-6 space-y-3 max-h-[52vh] overflow-y-auto">

        {/* Drag handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-1" />

        {/* Pinned location card */}
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-2xl px-3 py-3">
          {/* Pin icon */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center shadow-md">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="w-0.5 h-3 bg-orange-300 mt-0.5" />
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
          </div>
          {/* Address text */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-orange-400 uppercase tracking-wide">Pinned Location</p>
            <p className="text-sm font-semibold text-gray-900 leading-snug mt-0.5">
              {address
                ? address.split(',').slice(0, 2).join(',')
                : <span className="text-gray-400 font-normal">Drag pin or tap map to set</span>}
            </p>
            {address && (
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {address.split(',').slice(2).join(',').trim()}
                {pincode ? ` · ${pincode}` : ''}
              </p>
            )}
          </div>
          {/* Geocoding indicator */}
          {!address && mapsReady && (
            <div className="w-4 h-4 border-2 border-orange-300 border-t-orange-500 rounded-full animate-spin shrink-0" />
          )}
        </div>

        {/* Floor / flat */}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Full Name *"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="Phone Number * (10 digits)"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <input
          type="text"
          value={floor}
          onChange={e => setFloor(e.target.value)}
          placeholder="Flat / Floor / Building (optional)"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Label */}
        <div>
          <p className="text-xs text-gray-400 mb-1.5">Save as</p>
          <div className="flex gap-2">
            {(['Home', 'Work', 'Other'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLabel(l)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  label === l
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          {label === 'Other' && (
            <input
              type="text"
              value={customLabel}
              onChange={e => setCustomLabel(e.target.value)}
              placeholder="Enter label (e.g. Parents' Home)"
              className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          )}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving || !name.trim() || !phone.trim() || phone.length < 10}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${
            serviceable !== false && name.trim() && phone.trim() && phone.length >= 10
              ? 'bg-orange-500 text-white active:bg-orange-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {saving ? 'Saving...' : serviceable === false ? 'Outside Delivery Zone' : editAddressId ? 'Update Location' : 'Confirm Location'}
        </button>
      </div>
    </div>
  );
}
