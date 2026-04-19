import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { supabase } from "../../lib/supabase";
import { MapPin, Plus, Edit, Trash2, Home, Briefcase, Star, Check } from "lucide-react";

interface Address {
  id: string;
  name: string;
  phone: string;
  house_no?: string;
  building?: string;
  landmark?: string;
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAddresses();
  }, []);



  const loadAddresses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });
    
    setAddresses(data || []);
    setLoading(false);
  };



  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Delete button clicked for ID:', id);
    
    // Simple confirm dialog
    const shouldDelete = confirm("Delete this address?");
    console.log('User confirmed:', shouldDelete);
    
    if (!shouldDelete) {
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.id);
      
      if (!user) {
        alert('Please login to delete address');
        return;
      }

      console.log('Attempting to delete address:', id);
      
      const { error } = await supabase
        .from("user_addresses")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
        
      if (error) {
        console.error('Delete error:', error);
        alert('Failed to delete address: ' + error.message);
        return;
      }
      
      console.log('Delete successful, reloading addresses');
      
      // Reload addresses
      await loadAddresses();
      
      alert('Address deleted successfully!');
      
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete address. Please try again.');
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

  const buildDisplayAddress = (addr: Address) => {
    const parts: string[] = [];
    if (addr.house_no) parts.push(addr.house_no);
    if (addr.building) parts.push(addr.building);
    const line1 = parts.length > 0 ? parts.join(', ') : addr.address_line1.split(',')[0];
    const line2parts: string[] = [];
    if (parts.length > 0) line2parts.push(addr.address_line1.split(',')[0]);
    if (addr.landmark) line2parts.push(`Near ${addr.landmark}`);
    if (addr.pincode) line2parts.push(addr.pincode);
    return { line1, line2: line2parts.join(' · ') || addr.city };
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Addresses</h2>
        <Button onClick={() => navigate('/select-location')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </CardContent>
            </Card>
          ))
        ) : addresses.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium mb-2">No saved addresses yet</p>
            <p className="text-sm mb-4">Add your first delivery address</p>
            <Button onClick={() => navigate('/select-location')} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </div>
        ) : (
          addresses.map((address) => {
            const lbl = address.name.toLowerCase();
            const Icon = lbl.includes('home') ? Home : lbl.includes('work') || lbl.includes('office') ? Briefcase : Star;
            const { line1, line2 } = buildDisplayAddress(address);
            
            return (
              <Card key={address.id} className={address.is_default ? "border-orange-500 border-2" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        address.is_default ? 'bg-orange-500' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${address.is_default ? 'text-white' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{address.name}</CardTitle>
                          {address.is_default && (
                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded font-semibold">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-9 w-9 p-0"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(`/address-map?edit=${address.id}`);
                        }}
                        type="button"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-9 w-9 p-0"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(address.id, e);
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(address.id, e as any);
                        }}
                        type="button"
                        aria-label="Delete address"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-gray-900 mb-1">{line1}</p>
                  <p className="text-sm text-gray-600">{line2}</p>
                  {!address.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => setDefault(address.id)}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Set as Default
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
