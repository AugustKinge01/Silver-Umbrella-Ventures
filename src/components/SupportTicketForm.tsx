
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePlans } from "@/contexts/PlanContext";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare } from "lucide-react";

const SupportTicketForm = () => {
  const { submitSupportTicket, hotspots } = usePlans();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    hotspotId: '',
    subject: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await submitSupportTicket({
        userId: user.id,
        hotspotId: formData.hotspotId,
        subject: formData.subject,
        description: formData.description,
        priority: formData.priority,
        status: 'open',
      });

      // Reset form
      setFormData({
        hotspotId: '',
        subject: '',
        description: '',
        priority: 'medium',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare size={20} />
          Submit Support Request
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="hotspot">Related Hotspot</Label>
            <Select
              value={formData.hotspotId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, hotspotId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a hotspot" />
              </SelectTrigger>
              <SelectContent>
                {hotspots.map((hotspot) => (
                  <SelectItem key={hotspot.id} value={hotspot.id}>
                    {hotspot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Brief description of the issue"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of the issue or request"
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Submitting...' : 'Submit Support Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SupportTicketForm;
