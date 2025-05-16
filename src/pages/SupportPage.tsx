
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Phone, Mail, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const SupportPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    issueType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      issueType: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.issueType || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would submit to Supabase
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Support Request Sent",
        description: "We've received your message and will respond shortly.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        issueType: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Error Submitting Request",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout
      title="Support"
      description="Get help with your internet and power services"
    >
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Fill out the form below and our team will get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234..."
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issueType">Issue Type *</Label>
                    <Select
                      value={formData.issueType}
                      onValueChange={handleSelectChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an issue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internet">Internet Service Issue</SelectItem>
                        <SelectItem value="power">Power Service Issue</SelectItem>
                        <SelectItem value="payment">Payment Problem</SelectItem>
                        <SelectItem value="voucher">Voucher Not Working</SelectItem>
                        <SelectItem value="account">Account Problem</SelectItem>
                        <SelectItem value="other">Other Issue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please describe your issue in detail..."
                    rows={5}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Submit Support Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone size={20} className="text-silver-500 mt-1" />
                <div>
                  <h3 className="font-medium">Phone Support</h3>
                  <p className="text-sm text-silver-600">+234 700 0000 000</p>
                  <p className="text-xs text-silver-500">Mon-Fri, 9am-5pm</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail size={20} className="text-silver-500 mt-1" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm text-silver-600">support@silverumbrella.network</p>
                  <p className="text-xs text-silver-500">We aim to respond within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MessageSquare size={20} className="text-silver-500 mt-1" />
                <div>
                  <h3 className="font-medium">Telegram</h3>
                  <p className="text-sm text-silver-600">@SilverUmbrellaSupport</p>
                  <p className="text-xs text-silver-500">Live support during business hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm">How do I activate my voucher?</h3>
                <p className="text-sm text-silver-600">Go to the Vouchers section and click "Activate" on your unused voucher.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm">What if I'm having connection issues?</h3>
                <p className="text-sm text-silver-600">Try restarting your device or moving closer to a hotspot location.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm">Can I share my voucher?</h3>
                <p className="text-sm text-silver-600">Vouchers are tied to your account and cannot be transferred.</p>
              </div>
              
              <Button variant="link" className="px-0 flex items-center">
                <span>View all FAQs</span>
                <ArrowRight size={16} className="ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SupportPage;
