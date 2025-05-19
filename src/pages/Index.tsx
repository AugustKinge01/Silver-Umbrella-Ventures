import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wifi, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import QRCodeGenerator from "@/components/QRCodeGenerator";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // Get the current app URL for QR code
  const appUrl = window.location.origin;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="relative bg-gradient-to-r from-silver-900 to-silver-700 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center text-white">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Decentralized Internet & Power for Rural Communities
            </h1>
            <p className="text-lg md:text-xl mb-6 text-silver-100">
              Silver Umbrella brings affordable high-speed internet and reliable solar power to underserved areas in Nigeria.
            </p>
            <div className="flex flex-wrap gap-4">
              {user ? (
                <Button 
                  size="lg" 
                  className="bg-silver-300 hover:bg-silver-400" 
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="bg-silver-300 hover:bg-silver-400" 
                  onClick={() => navigate('/login')}
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-silver-300 rounded-full p-3">
                  <Wifi size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">High-Speed Internet</h3>
                  <p className="text-silver-200">Starlink-powered connectivity</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-silver-300 rounded-full p-3">
                  <Zap size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">Reliable Power</h3>
                  <p className="text-silver-200">Solar mini-grid solutions</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-silver-300 text-white px-4 py-2 rounded shadow-md text-sm font-semibold">
              Now Available in Ijero-Ekiti
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How Silver Umbrella Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-silver-50 rounded-lg p-6">
              <div className="bg-silver-300 text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Choose a Plan</h3>
              <p className="text-silver-700">Select from our range of affordable internet and power plans tailored to your needs.</p>
            </div>
            
            <div className="bg-silver-50 rounded-lg p-6">
              <div className="bg-silver-300 text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Make Payment</h3>
              <p className="text-silver-700">Pay with your card, mobile money, or cryptocurrency in just a few clicks.</p>
            </div>
            
            <div className="bg-silver-50 rounded-lg p-6">
              <div className="bg-silver-300 text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Get Connected</h3>
              <p className="text-silver-700">Receive your access voucher instantly and connect to our network.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* New QR Code section */}
      <div className="bg-silver-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Instant Access</h2>
            <p className="text-silver-600 max-w-lg mx-auto">
              Scan the QR code below with your mobile device to instantly access Silver Umbrella services.
            </p>
          </div>
          
          <div className="max-w-xs mx-auto">
            <QRCodeGenerator 
              url={appUrl}
              title="Access Silver Umbrella" 
              description="Scan to open the app on your device" 
            />
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-silver-100 py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Connected?</h2>
          <p className="text-silver-700 mb-8 max-w-xl mx-auto">
            Join hundreds of others enjoying reliable internet and power access in Ekiti State.
          </p>
          {user ? (
            <Button 
              size="lg" 
              className="bg-silver-500 hover:bg-silver-600 text-white"
              onClick={() => navigate('/plans')}
            >
              View Available Plans
            </Button>
          ) : (
            <Button 
              size="lg" 
              className="bg-silver-500 hover:bg-silver-600 text-white"
              onClick={() => navigate('/login')}
            >
              Create Account
            </Button>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-silver-900 text-silver-200 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-white text-lg mb-4">Silver Umbrella Ventures</h3>
              <p className="mb-4">Building infrastructure where institutions have failed.</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-silver-300">Twitter</a>
                <a href="#" className="hover:text-silver-300">Telegram</a>
                <a href="#" className="hover:text-silver-300">Email</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-white text-lg mb-4">Service Areas</h3>
              <ul className="space-y-2">
                <li>Ijero-Ekiti</li>
                <li>Ekiti State University</li>
                <li>Ado-Ekiti</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-white text-lg mb-4">Contact</h3>
              <p>Email: info@silverumbrella.network</p>
              <p>Phone: +234 700 0000 000</p>
            </div>
          </div>
          
          <div className="border-t border-silver-800 mt-8 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} Silver Umbrella Ventures. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
