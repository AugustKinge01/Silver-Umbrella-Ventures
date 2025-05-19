
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import QRCode from "react-qr-code";

interface QRCodeGeneratorProps {
  url: string;
  title?: string;
  description?: string;
  size?: number;
}

const QRCodeGenerator = ({
  url,
  title = "Scan to access",
  description = "Scan this QR code with your phone camera",
  size = 128,
}: QRCodeGeneratorProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-6 pb-4 px-4 flex flex-col items-center">
        <div className="bg-white p-3 rounded-lg mb-3">
          <QRCode value={url} size={size} />
        </div>
        
        <div className="text-center mt-2">
          <div className="flex items-center justify-center mb-1">
            <QrCode size={16} className="mr-1 text-silver-600" />
            <p className="font-medium text-sm">{title}</p>
          </div>
          <p className="text-xs text-silver-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
