import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/uiStore";
import QRCode from "qrcode";
import { Download, Copy, Check, ExternalLink } from "lucide-react";

export function QRModal() {
  const { qrModalOpen, qrUrl, setQRModalOpen } = useUIStore();
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (qrModalOpen && qrUrl) {
      QRCode.toDataURL(qrUrl, {
        color: { dark: "#0a0a0f", light: "#00f0ff" },
        width: 300,
        margin: 2,
        errorCorrectionLevel: "M",
      }).then(setQrDataUrl);
    }
  }, [qrModalOpen, qrUrl]);

  const handleCopy = () => {
    if (qrUrl) {
      navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `gestureforge-anchor.png`;
    link.click();
  };

  const handleOpen = () => {
    if (qrUrl) window.open(qrUrl, "_blank");
  };

  // URL corta para mostrar (sin el payload largo)
  const displayUrl = qrUrl
    ? qrUrl.replace(/(\?s=).+/, "$1[escena codificada]")
    : "";

  return (
    <Dialog open={qrModalOpen} onOpenChange={(open) => setQRModalOpen(open)}>
      <DialogContent className="bg-[#16161f] border-[#2a2a3a] text-[#e8e8f0] max-w-sm">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "Syne, sans-serif" }} className="text-[#00f0ff]">
            Anclaje QR Creado
          </DialogTitle>
          <DialogDescription className="text-[#5a5a72]">
            Escanea con cualquier dispositivo — la escena completa está codificada en el enlace.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5 pt-2">
          {qrDataUrl ? (
            <div className="p-3 bg-white rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.2)]">
              <img src={qrDataUrl} alt="QR Code" className="w-52 h-52" />
            </div>
          ) : (
            <div className="w-52 h-52 flex items-center justify-center border border-[#2a2a3a] rounded-xl">
              <span className="text-[#5a5a72] text-sm font-mono">Generando...</span>
            </div>
          )}

          <div className="w-full space-y-3">
            <div className="p-2.5 bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg font-mono text-xs text-[#5a5a72] break-all">
              {displayUrl}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="border-[#2a2a3a] hover:bg-[#2a2a3a] hover:text-[#00f0ff] font-mono text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? "Copiado" : "Copiar"}
              </Button>
              <Button
                onClick={handleOpen}
                variant="outline"
                size="sm"
                className="border-[#2a2a3a] hover:bg-[#2a2a3a] hover:text-[#7b2fff] font-mono text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                Abrir
              </Button>
              <Button
                onClick={handleDownload}
                size="sm"
                className="bg-[#00f0ff] text-[#0a0a0f] hover:bg-[#00f0ff]/80 font-mono text-xs"
                disabled={!qrDataUrl}
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                PNG
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
