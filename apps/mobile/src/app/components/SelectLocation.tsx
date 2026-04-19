import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { MapPin, Plus, Check, ArrowLeft, Navigation, Search, X, Home, Briefcase, Star } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "@/app/context/auth";
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

interface Address {
  id: string;
  name: string;
  house_no?: string;
  building?: string;
  landmark?: string;
  address_line1: string;
  pincode: string;
  is_default: boolean;
}

function buildDisplayAddress(addr: Address): { line1: string; line2: string } {
  const isCoords = /^-?\d+\.\d+,\s*-?\d+\.\d+$/.test((addr.address_line1 ?? '').trim());
  const parts: string[] = [];
  if (addr.house_no) parts.push(addr.house_no);
  if (addr.building) parts.push(addr.building);
  const area = isCoords ? 'Pune' : addr.address_line1.split(',')[0].trim();
  const line1 = parts.length > 0 ? parts.join(', ') : area;
  const line2parts: string[] = [];
  if (parts.length > 0) line2parts.push(area);
  if (addr.landmark) line2parts.push(`Near ${addr.landmark}`);
  if (addr.pincode) line2parts.push(addr.pincode);
  return { line1, line2: line2parts.join(' · ') || 'Pune' };
}

const SERVICEABLE_AREAS = [
  { name: "Wagholi", sub: "East Pune" },
  { name: "Kharadi", sub: "East Pune" },
  { name: "Viman Nagar", sub: "North-East Pune" },
  { name: "Chandan Nagar", sub: "East Pune" },
  { name: "Hadapsar", sub: "South-East Pune" },
];

export default function SelectLocation() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');
  const [mapsReady, setMapsReady] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const searchRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<any>(null);
  const debounceTimer = useRef<any>(null);

  // Load Google Maps + Places
  useEffect(() => {
    const init = () => {
      setMapsReady(true);
      autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
    };
    if ((window as any).google?.maps?.places) { init(); return; }
    const existing = document.querySelector('script[data-gmap]') as HTMLScriptElement | null;
    if (existing) { existing.addEventListener('load', init); return; }
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    s.async = true;
    s.setAttribute('data-gmap', '1');
    s.onload = init;
    document.head.appendChild(s);
  }, []);

  const loadAddresses = () => {
    if (!user) return;
    supabase
      .from('user_addresses')
      .select('id, name, house_no, building, landmark, address_line1, pincode, is_default')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('SelectLocation fetch error:', error);
        const list = data ?? [];
        if (list.length > 0 && !list.some(a => a.is_default)) list[0].is_default = true;
        setAddresses(list);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    loadAddresses();
  }, [user]);

  // Reload when returning from address-map
  useEffect(() => { loadAddresses(); }, []);

  const selectAddress = async (id: string) => {
    if (!user) return;
    await supabase.from('user_addresses').update({ is_default: false }).eq('user_id', user.id);
    await supabase.from('user_addresses').update({ is_default: true }).eq('id', id);
    navigate(-1);
  };

  const useCurrentLocation = async () => {
    setLocating(true);
    setLocError('');
    try {
      if (Capacitor.isNativePlatform()) {
        const permission = await Geolocation.requestPermissions();
        if (permission.location !== 'granted') {
          setLocError('Location permission denied. Please enable it in settings.');
          setLocating(false);
          return;
        }
        await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
      } else {
        await new Promise<void>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(() => resolve(), reject, { enableHighAccuracy: true, timeout: 10000 })
        );
      }
      setLocating(false);
      navigate('/address-map?useCurrentLocation=true');
    } catch (err: any) {
      setLocating(false);
      if (err.code === 1 || err.message?.includes('denied')) {
        setLocError('Location permission denied. Please enable it in settings.');
      } else {
        setLocError('Unable to get location. Please try again.');
      }
    }
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setSuggestions([]);
    setShowSuggestions(false);
    if (!val.trim() || val.trim().length < 2 || !autocompleteService.current) return;
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      autocompleteService.current.getPlacePredictions(
        {
          input: val,
          componentRestrictions: { country: 'in' },
          bounds: new (window as any).google.maps.LatLngBounds(
            new (window as any).google.maps.LatLng(18.4089, 73.7797),
            new (window as any).google.maps.LatLng(18.6793, 74.0865)
          ),
        },
        (predictions: any[], status: string) => {
          if (status === 'OK' && predictions?.length) {
            setSuggestions(predictions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }
      );
    }, 300);
  };

  const handleSuggestionPick = (s: any) => {
    setSearch(s.structured_formatting?.main_text ?? s.description.split(',')[0]);
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(`/address-map?place_id=${s.place_id}&desc=${encodeURIComponent(s.description)}`);
  };

  const filtered = addresses.filter(a =>
    !search.trim() ||
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.address_line1.toLowerCase().includes(search.toLowerCase()) ||
    (a.building ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (a.landmark ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (a.pincode ?? '').includes(search)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 flex items-center gap-3 px-4 h-14">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-base font-bold text-gray-900">Select Location</h1>
      </div>

      <div className="px-4 py-4 space-y-4">

        {/* 1. Add New Address - toggles search/location options */}
        <button
          onClick={() => setShowAddOptions(v => !v)}
          className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-dashed border-orange-300 active:bg-orange-50"
        >
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Plus className={`w-5 h-5 text-orange-500 transition-transform ${showAddOptions ? 'rotate-45' : ''}`} />
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-semibold text-orange-600">Add New Address</p>
            <p className="text-xs text-gray-400">Wagholi, Kharadi, Viman Nagar & more</p>
          </div>
        </button>

        {/* 2. Search + Current Location — shown only after tapping Add New Address */}
        {showAddOptions && (
          <div className="space-y-3 pl-1">
            {/* Search bar with autocomplete */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search area, building, street..."
                className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-9 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {search && (
                <button
                  onClick={() => { setSearch(''); setSuggestions([]); setShowSuggestions(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  {suggestions.map((s: any, i: number) => (
                    <button
                      key={s.place_id}
                      onMouseDown={() => handleSuggestionPick(s)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left active:bg-orange-50 ${
                        i < suggestions.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {s.structured_formatting?.main_text ?? s.description.split(',')[0]}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {s.structured_formatting?.secondary_text ?? s.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Use Current Location */}
            <button
              onClick={useCurrentLocation}
              disabled={locating}
              className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 active:bg-gray-50"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Navigation className={`w-5 h-5 text-blue-500 ${locating ? 'animate-pulse' : ''}`} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-blue-600">{locating ? 'Detecting location...' : 'Use My Current Location'}</p>
                <p className="text-xs text-gray-400">Using GPS</p>
              </div>
            </button>
            {locError && <p className="text-xs text-red-500 -mt-2 px-1">{locError}</p>}
          </div>
        )}

        {/* Serviceable Areas quick-pick (only when not searching) */}
        {!search.trim() && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase px-1 mb-2">Serviceable Areas</p>
            <div className="flex gap-2 flex-wrap">
              {SERVICEABLE_AREAS.map(area => (
                <button
                  key={area.name}
                  onClick={() => navigate('/address-map')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 active:bg-orange-50 active:border-orange-300"
                >
                  <MapPin className="w-3 h-3 text-orange-400" />
                  {area.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Saved Addresses */}
        <div>
          <div className="flex items-center justify-between px-1 mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase">Saved Addresses</p>
            {addresses.length > 0 && (
              <span className="text-xs text-orange-500 font-medium">{addresses.length} saved</span>
            )}
          </div>
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 mb-2 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              ))
            ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">{search ? `No results for "${search}"` : 'No saved addresses yet'}</p>
              {!search && (
                <button
                  onClick={() => navigate('/address-map')}
                  className="mt-3 text-xs text-orange-500 font-semibold underline"
                >
                  Add your first address
                </button>
              )}
            </div>
          ) : (
            filtered.map(addr => {
              const lbl = addr.name.toLowerCase();
              const Icon = lbl.includes('home') ? Home : lbl.includes('work') || lbl.includes('office') ? Briefcase : Star;
              const { line1, line2 } = buildDisplayAddress(addr);
              return (
                <button
                  key={addr.id}
                  onClick={() => selectAddress(addr.id)}
                  className={`w-full flex items-start gap-3 p-4 bg-white rounded-xl border-2 text-left mb-2 transition-colors active:bg-orange-50 ${
                    addr.is_default ? 'border-orange-400 shadow-sm' : 'border-gray-100'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    addr.is_default ? 'bg-orange-500' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${addr.is_default ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-gray-900">{addr.name}</p>
                      {addr.is_default && (
                        <span className="text-[10px] bg-orange-100 text-orange-600 font-semibold px-1.5 py-0.5 rounded-full">Delivering here</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 truncate">{line1}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{line2}</p>
                  </div>
                  {addr.is_default ? (
                    <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <span className="text-xs text-gray-300 shrink-0 mt-1">Select</span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Delivery info note */}
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex gap-2">
          <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
          <p className="text-xs text-orange-700">
            We currently deliver only in <span className="font-semibold">Pune</span> — Wagholi, Kharadi, Chandan Nagar, Viman Nagar & Hadapsar (within 5km radius).
          </p>
        </div>

      </div>
    </div>
  );
}
