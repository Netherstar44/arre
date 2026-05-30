import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/uiStore";
import QRCode from "qrcode";
import { Download, Copy, Check } from "lucide-react";

export function QRModal() {
  const { qrModalOpen, qrAnchorId, setQRModalOpen } = useUIStore();
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const anchorUrl = qrAnchorId ? `${window.location.origin}/anchor/${qrAnchorId}` : "";

  useEffect(() => {
    if (qrModalOpen && anchorUrl) {
      QRCode.toDataURL(anchorUrl, {
        color: {
          dark: "#0a0a0f",
          light: "#00f0ff"
        },
        width: 300,
        margin: 2
      }).then(setQrDataUrl);
    }
  }, [qrModalOpen, anchorUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(anchorUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `gestureforge-anchor-${qrAnchorId}.png`;
    link.click();
  };

  return (
    <Dialog open={qrModalOpen} onOpenChange={(open) => setQRModalOpen(open)}>
      <DialogContent className="bg-[#16161f] border-[#2a2a3a] text-[#e8e8f0]">
        <DialogHeader>
          <DialogTitle className="font-serif text-[#00f0ff]">Anclaje QR Creado</DialogTitle>
          <DialogDescription className="text-[#5a5a72]">
            Escanea este código QR con un dispositivo móvil para ver el modelo 3D en Realidad Aumentada.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-6 space-y-6">
          {qrDataUrl ? (
            <div className="p-4 bg-white rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.15)]">
              <img src={qrDataUrl} alt="QR Code" className="w-48 h-48" />
            </div>
          ) : (
            <div className="w-48 h-48 flex items-center justify-center border border-[#2a2a3a] rounded-xl">
              <span className="text-[#5a5a72]">Generando...</span>
            </div>
          )}

          <div className="w-full space-y-3">
            <div className="p-3 bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg font-mono text-sm text-[#e8e8f0] break-all">
              {anchorUrl}
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleCopy} variant="outline" className="flex-1 border-[#2a2a3a] hover:bg-[#2a2a3a] hover:text-[#00f0ff]">
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copiado" : "Copiar enlace"}
              </Button>
              <Button onClick={handleDownload} className="flex-1 bg-[#00f0ff] text-[#0a0a0f] hover:bg-[#00f0ff]/80">
                <Download className="w-4 h-4 mr-2" />
                Descargar PNG
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
