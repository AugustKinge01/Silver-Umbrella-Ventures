
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/AuthContext";
import { Zap } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { user, sendOTP, verifyOTP, isLoading } = useAuth();
  
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate(user.isAdmin ? "/admin" : "/dashboard");
    return null;
  }

  const handleSendOTP = async () => {
    if (!phone.trim()) return;
    const formatted = formatPhoneNumber(phone);
    const success = await sendOTP(formatted);
    if (success) {
      setOtpSent(true);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) return;
    const formatted = formatPhoneNumber(phone);
    const success = await verifyOTP(formatted, otp);
    if (success) {
      navigate("/dashboard");
    }
  };

  const formatPhoneNumber = (number: string) => {
    // Basic formatting: ensure number starts with +234
    let formatted = number.trim();
    if (formatted.startsWith("0")) {
      formatted = "+234" + formatted.substring(1);
    } else if (!formatted.startsWith("+")) {
      formatted = "+234" + formatted;
    }
    return formatted;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-silver-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="bg-silver-300 text-white p-2 rounded-md">
              <Zap size={24} />
            </div>
            <span className="font-bold text-xl text-silver-900">Silver Umbrella</span>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              {!otpSent 
                ? "Enter your phone number to continue" 
                : "Enter the verification code sent to your phone"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!otpSent ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+234 800 0000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-silver-600">
                    We'll send a verification code to this number
                  </p>
                </div>
                
                <Button
                  className="w-full"
                  onClick={handleSendOTP}
                  disabled={!phone.trim() || isLoading}
                >
                  {isLoading ? (
                    <><Spinner size="sm" className="mr-2" /> Sending code...</>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    disabled={isLoading}
                  />
                </div>
                
                <Button
                  className="w-full"
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6 || isLoading}
                >
                  {isLoading ? (
                    <><Spinner size="sm" className="mr-2" /> Verifying...</>
                  ) : (
                    "Verify & Login"
                  )}
                </Button>
                
                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => setOtpSent(false)}
                    disabled={isLoading}
                  >
                    Change phone number
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-silver-600">
              By continuing, you agree to our 
              <Button variant="link" className="p-0 h-auto font-normal"> Terms of Service </Button>
              and
              <Button variant="link" className="p-0 h-auto font-normal"> Privacy Policy</Button>.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
