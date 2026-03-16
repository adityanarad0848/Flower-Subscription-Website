import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { supabase } from "../../lib/supabase";
import { MapPin, Plus, Edit, Trash2, Navigation } from "lucide-react";

interface Address {
  id: string;
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
  is_serviceable: boolean;
}

const SERVICEABLE_AREAS = [
  { name: "Wagholi", lat: 18.5793, lng: 73.9865, radius: 5 },
  { name: "Kharadi", lat: 18.5515, lng: 73.9474, radius: 5 },
  { name: "Chandan Nagar", lat: 18.5362, lng: 73.8797, radius: 5 },
  { name: "Viman Nagar", lat: 18.5679, lng: 73.9143, radius: 5 },
  { name: "Hadapsar", lat: 18.5089, lng: 73.9260, radius: 5 },
];

export function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const autocompleteRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    loadAddresses();
    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (mapsLoaded && dialogOpen && inputRef.current) {
      initAutocomplete();
    }
  }, [mapsLoaded, dialogOpen]);

  const loadGoogleMaps = () => {
    if (window.google?.maps) {
      setMapsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => setMapsLoaded(true);
    document.head.appendChild(script);
  };

  const initAutocomplete = () => {
    if (!inputRef.current || !window.google) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "in" },
      types: ["address"],
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        let address = "";
        let city = "";
        let state = "";
        let pincode = "";

        place.address_components?.forEach((component: any) => {
          const types = component.types;
          if (types.includes("street_number") || types.includes("route")) {
            address += component.long_name + " ";
          }
          if (types.includes("locality")) {
            city = component.long_name;
          }
          if (types.includes("administrative_area_level_1")) {
            state = component.long_name;
          }
          if (types.includes("postal_code")) {
            pincode = component.long_name;
          }
        });

        setFormData({
          ...formData,
          address_line1: address.trim() || place.formatted_address || "",
          city: city,
          state: state,
          pincode: pincode,
          latitude: lat,
          longitude: lng,
        });
      }
    });
  };

  const loadAddresses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });
    
    setAddresses(data || []);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const checkServiceability = (lat: number, lng: number) => {
    for (const area of SERVICEABLE_AREAS) {
      const distance = calculateDistance(lat, lng, area.lat, area.lng);
      if (distance <= area.radius) {
        return true;
      }
    }
    return false;
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Location access not available. Please type your address.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (!window.google) return;

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
          if (status === "OK" && results?.[0]) {
            const place = results[0];
            let address = "";
            let city = "";
            let state = "";
            let pincode = "";

            place.address_components?.forEach((component: any) => {
              const types = component.types;
              if (types.includes("street_number") || types.includes("route")) {
                address += component.long_name + " ";
              }
              if (types.includes("locality")) {
                city = component.long_name;
              }
              if (types.includes("administrative_area_level_1")) {
                state = component.long_name;
              }
              if (types.includes("postal_code")) {
                pincode = component.long_name;
              }
            });

            setFormData({
              ...formData,
              address_line1: address.trim() || place.formatted_address || "",
              city: city,
              state: state,
              pincode: pincode,
              latitude: lat,
              longitude: lng,
            });
          }
        });
      },
      (error) => {
        if (error.code === 1) {
          alert("Location permission denied. Please allow location access in your browser settings or type your address manually.");
        } else {
          alert("Unable to get location. Please type your address.");
        }
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (!formData.latitude || !formData.longitude) {
      alert("Please select an address from the suggestions or use current location");
      return;
    }

    const isServiceable = checkServiceability(formData.latitude, formData.longitude);

    if (!isServiceable) {
      alert("Sorry, we don't deliver to this area yet. We serve Wagholi, Kharadi, Chandan Nagar, Viman Nagar, Hadapsar and 5km around these areas.");
      return;
    }

    const addressData = {
      ...formData,
      user_id: user.id,
      is_serviceable: isServiceable,
      is_default: addresses.length === 0,
    };

    if (editingAddress) {
      await supabase
        .from("user_addresses")
        .update(addressData)
        .eq("id", editingAddress.id);
    } else {
      await supabase.from("user_addresses").insert(addressData);
    }

    setDialogOpen(false);
    setEditingAddress(null);
    setFormData({
      name: "",
      phone: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      pincode: "",
      latitude: 0,
      longitude: 0,
    });
    loadAddresses();
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      latitude: address.latitude || 0,
      longitude: address.longitude || 0,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this address?")) {
      await supabase.from("user_addresses").delete().eq("id", id);
      loadAddresses();
    }
  };

  const setDefault = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("user_addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);

    await supabase
      .from("user_addresses")
      .update({ is_default: true })
      .eq("id", id);

    loadAddresses();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Addresses</h2>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
      </div>

      <div className="grid gap-4">
        {addresses.map((address) => (
          <Card key={address.id} className={address.is_default ? "border-orange-500 border-2" : ""}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{address.name}</CardTitle>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                  {address.is_default && (
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded mt-2 inline-block">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(address)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(address.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">
                {address.address_line1}
                {address.address_line2 && `, ${address.address_line2}`}
              </p>
              <p className="text-sm text-gray-700">
                {address.city}, {address.state} - {address.pincode}
              </p>
              {!address.is_default && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setDefault(address.id)}
                >
                  Set as Default
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Phone Number *</Label>
                <Input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Search Address *</Label>
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  required
                  placeholder="Start typing your address..."
                  value={formData.address_line1}
                  onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                  className="flex-1"
                />
                <Button type="button" onClick={getCurrentLocation} variant="outline">
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Type and select from suggestions</p>
            </div>

            <div>
              <Label>Apartment/Floor/Building (Optional)</Label>
              <Input
                value={formData.address_line2}
                onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>City *</Label>
                <Input
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <Label>State *</Label>
                <Input
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div>
                <Label>Pincode *</Label>
                <Input
                  required
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Serviceable Areas in Pune
              </h4>
              <p className="text-sm text-gray-600 mb-2">We deliver to these areas + 5km radius:</p>
              <ul className="text-sm space-y-1">
                <li>• Wagholi</li>
                <li>• Kharadi</li>
                <li>• Chandan Nagar</li>
                <li>• Viman Nagar</li>
                <li>• Hadapsar</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                {editingAddress ? "Update Address" : "Save Address"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  setEditingAddress(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
