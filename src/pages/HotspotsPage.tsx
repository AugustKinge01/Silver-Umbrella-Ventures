
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Search, Wifi, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePlans } from "@/contexts/PlanContext";
import hotspotsGraphicImage from "@/assets/hotspots-graphic.jpg";

const HotspotsPage = () => {
  const { hotspots } = usePlans();
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState<'all' | 'internet' | 'power'>('all');

  // Filter hotspots based on search query and service filter
  const filteredHotspots = hotspots.filter(hotspot => {
    // Filter by search query
    const matchesSearch = 
      hotspot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotspot.location.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Filter by service type
    const matchesService = 
      serviceFilter === 'all' || 
      (serviceFilter === 'internet' && hotspot.services.includes('internet')) ||
      (serviceFilter === 'power' && hotspot.services.includes('power'));
      
    return matchesSearch && matchesService;
  });

  // Group hotspots by status
  const activeHotspots = filteredHotspots.filter(h => h.status === 'active');
  const maintenanceHotspots = filteredHotspots.filter(h => h.status === 'maintenance');
  const inactiveHotspots = filteredHotspots.filter(h => h.status === 'inactive');

  // Function to get user's current location (mock)
  const getCurrentLocation = () => {
    // In a real app, this would use the browser's Geolocation API
    alert("This would get your current location and show nearby hotspots.");
  };

  return (
    <Layout
      title="Find Hotspots"
      description="Locate Silver Umbrella hotspots near you"
    >
      {/* Hotspots hero section */}
      <div className="relative bg-gradient-to-br from-blue-50/80 to-green-50/80 rounded-xl p-8 mb-8 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={hotspotsGraphicImage} 
            alt="Network hotspots and coverage"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/85 to-background/70"></div>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-bold mb-3">Find Network Hotspots</h1>
          <p className="text-lg text-muted-foreground">Discover internet and power access points in your area</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-silver-400" size={18} />
            <Input
              placeholder="Search by location or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={getCurrentLocation}
          >
            <MapPin size={16} />
            <span>Find Near Me</span>
          </Button>
        </div>
        
        <Tabs defaultValue="all" value={serviceFilter} onValueChange={(value) => setServiceFilter(value as 'all' | 'internet' | 'power')}>
          <TabsList>
            <TabsTrigger value="all">All Services</TabsTrigger>
            <TabsTrigger value="internet">Internet Only</TabsTrigger>
            <TabsTrigger value="power">Power Only</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="space-y-8">
        {activeHotspots.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Hotspots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeHotspots.map(hotspot => (
                <Card key={hotspot.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold">{hotspot.name}</h3>
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        Online
                      </Badge>
                    </div>
                    
                    <div className="flex items-start gap-2 mb-3">
                      <MapPin size={16} className="text-silver-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-silver-700">{hotspot.location}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {hotspot.services.includes('internet') && (
                        <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs">
                          <Wifi size={12} />
                          <span>Internet</span>
                        </div>
                      )}
                      {hotspot.services.includes('power') && (
                        <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-full text-xs">
                          <Zap size={12} />
                          <span>Power</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {maintenanceHotspots.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Under Maintenance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {maintenanceHotspots.map(hotspot => (
                <Card key={hotspot.id} className="border-amber-200">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold">{hotspot.name}</h3>
                      <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                        Maintenance
                      </Badge>
                    </div>
                    
                    <div className="flex items-start gap-2 mb-3">
                      <MapPin size={16} className="text-silver-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-silver-700">{hotspot.location}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {hotspot.services.includes('internet') && (
                        <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs opacity-50">
                          <Wifi size={12} />
                          <span>Internet</span>
                        </div>
                      )}
                      {hotspot.services.includes('power') && (
                        <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-full text-xs opacity-50">
                          <Zap size={12} />
                          <span>Power</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {inactiveHotspots.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Offline Hotspots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inactiveHotspots.map(hotspot => (
                <Card key={hotspot.id} className="border-red-200 opacity-70">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold">{hotspot.name}</h3>
                      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                        Offline
                      </Badge>
                    </div>
                    
                    <div className="flex items-start gap-2 mb-3">
                      <MapPin size={16} className="text-silver-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-silver-700">{hotspot.location}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {hotspot.services.includes('internet') && (
                        <div className="flex items-center gap-1 bg-silver-100 text-silver-600 px-2 py-1 rounded-full text-xs">
                          <Wifi size={12} />
                          <span>Internet</span>
                        </div>
                      )}
                      {hotspot.services.includes('power') && (
                        <div className="flex items-center gap-1 bg-silver-100 text-silver-600 px-2 py-1 rounded-full text-xs">
                          <Zap size={12} />
                          <span>Power</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {filteredHotspots.length === 0 && (
          <Card className="bg-silver-50 border-dashed">
            <CardContent className="py-12 text-center">
              <MapPin className="mx-auto text-silver-400 mb-2" size={32} />
              <p className="text-silver-600 mb-1">No hotspots found matching your criteria</p>
              <p className="text-sm text-silver-500">Try adjusting your filters or search terms</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default HotspotsPage;
