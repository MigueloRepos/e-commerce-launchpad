import { useState } from "react";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
  className?: string;
}

export function WhatsAppButton({
  phoneNumber = "5350000000",
  defaultMessage = "¡Hola CondiRico! Deseo información sobre sus productos y envíos.",
  className = "",
}: WhatsAppButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const encodedMessage = encodeURIComponent(defaultMessage);
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  return (
    <aside
      aria-label="Contacto por WhatsApp"
      className={`fixed right-4 bottom-20 z-40 lg:right-6 lg:bottom-6 print:hidden ${className}`}
    >
      <div className="relative flex items-center justify-end group">
        {/* Tooltip on hover/focus */}
        <div
          role="tooltip"
          className={`pointer-events-none absolute right-[calc(100%+10px)] whitespace-nowrap rounded-xl bg-foreground px-3.5 py-1.5 text-xs font-bold text-background shadow-lg transition-all duration-200 ${
            showTooltip
              ? "translate-x-0 opacity-100"
              : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
          }`}
        >
          <span>¿Dudas? Chatea con nosotros</span>
          <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 border-4 border-transparent border-l-foreground" />
        </div>

        {/* WhatsApp Floating Action Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_16px_rgba(37,211,102,0.45)] transition-all duration-200 hover:scale-110 hover:bg-[#22bf5b] hover:shadow-[0_6px_22px_rgba(37,211,102,0.55)] active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
        >
          {/* Subtle pulse animation ring */}
          <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366] opacity-35 animate-ping" />

          {/* Official WhatsApp SVG icon */}
          <svg
            className="h-7 w-7 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.101-.477-.15-.678.15-.2.301-.778.978-.954 1.18-.175.2-.351.226-.652.075-.3-.15-1.267-.467-2.414-1.49-1.147-1.023-1.921-2.288-2.147-2.676-.226-.388-.024-.598.126-.748.136-.135.301-.351.452-.527.15-.175.2-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.678-1.631-.93-2.235-.245-.588-.493-.508-.678-.518-.175-.01-.376-.01-.577-.01-.2 0-.527.075-.803.376-.276.301-1.054 1.03-1.054 2.51 0 1.48 1.08 2.91 1.23 3.11.15.2 2.124 3.243 5.145 4.548.719.31 1.28.496 1.718.636.723.23 1.381.197 1.901.12.58-.087 1.78-.727 2.03-1.43.251-.703.251-1.305.176-1.43-.075-.126-.276-.201-.577-.351zM12.04 2C6.524 2 2.03 6.494 2.03 12.01c0 1.98.577 3.824 1.572 5.378L2 22l4.767-1.547c1.497.882 3.243 1.39 5.273 1.39 5.515 0 10.01-4.494 10.01-10.01C22.05 6.494 17.555 2 12.04 2zm0 18.278c-1.748 0-3.371-.478-4.769-1.31l-.342-.204-2.827.917.935-2.756-.224-.356A8.22 8.22 0 013.84 12.01c0-4.52 3.68-8.2 8.2-8.2 4.52 0 8.2 3.68 8.2 8.2 0 4.52-3.68 8.278-8.2 8.278z" />
          </svg>
        </a>
      </div>
    </aside>
  );
}
