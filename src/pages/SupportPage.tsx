
import Layout from "@/components/Layout";
import SupportTicketForm from "@/components/SupportTicketForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Mail, MapPin, Clock } from "lucide-react";
import { usePlans } from "@/contexts/PlanContext";
import { useAuth } from "@/contexts/AuthContext";
import supportGraphicImage from "@/assets/support-graphic.jpg";

const SupportPage = () => {
  const { supportTickets } = usePlans();
  const { user } = useAuth();

  // Filter tickets for current user
  const userTickets = supportTickets.filter(ticket => ticket.userId === user?.id);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-600';
      case 'high': return 'bg-orange-100 text-orange-600';
      case 'medium': return 'bg-yellow-100 text-yellow-600';
      case 'low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-600';
      case 'in-progress': return 'bg-amber-100 text-amber-600';
      case 'resolved': return 'bg-green-100 text-green-600';
      case 'closed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Layout
      title="Support & Help"
      description="Get help with your Silver Umbrella services"
    >
      {/* Support hero section */}
      <div className="relative bg-gradient-to-br from-green-50/80 to-blue-50/80 rounded-xl p-8 mb-8 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={supportGraphicImage} 
            alt="Customer support and help"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/75"></div>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-bold mb-3">Get Support & Help</h1>
          <p className="text-lg text-muted-foreground">We're here to help you 24/7 with any issues or questions</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Support Form */}
        <div>
          <SupportTicketForm />
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-silver-600" />
                <div>
                  <div className="font-medium">Phone Support</div>
                  <div className="text-sm text-silver-600">+234 XXX XXX XXXX</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-silver-600" />
                <div>
                  <div className="font-medium">Email Support</div>
                  <div className="text-sm text-silver-600">support@silverumbrella.ng</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-silver-600" />
                <div>
                  <div className="font-medium">Office Location</div>
                  <div className="text-sm text-silver-600">Lagos, Nigeria</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-silver-600" />
                <div>
                  <div className="font-medium">Support Hours</div>
                  <div className="text-sm text-silver-600">24/7 for urgent issues</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Help */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Help</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-medium text-sm">Connection Issues</div>
                <div className="text-xs text-silver-600">Check if you're within range of an active hotspot</div>
              </div>
              
              <div>
                <div className="font-medium text-sm">Voucher Problems</div>
                <div className="text-xs text-silver-600">Ensure your voucher is activated and not expired</div>
              </div>
              
              <div>
                <div className="font-medium text-sm">Payment Issues</div>
                <div className="text-xs text-silver-600">Verify your payment method and try again</div>
              </div>
              
              <div>
                <div className="font-medium text-sm">Slow Speeds</div>
                <div className="text-xs text-silver-600">Check signal strength and try moving closer to the hotspot</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Support Tickets History */}
      {userTickets.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Support Tickets</h2>
          <div className="space-y-4">
            {userTickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{ticket.subject}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-silver-600">
                      {ticket.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-silver-700 line-clamp-2">
                    {ticket.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SupportPage;
