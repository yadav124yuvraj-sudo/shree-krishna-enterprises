"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ENQUIRY_STATUS_LABELS } from "@/lib/admin-status";
import { buildStatusMessage, NOTIFY_STATUSES, type NotifyEnquiry } from "@/lib/notify-templates";
import { whatsappLink } from "@/lib/admin-helpers";

/**
 * Lets the admin send the customer a WhatsApp update for the current enquiry.
 * Nothing is sent automatically: choosing a status only fills in a suggested message,
 * which the admin can edit, and WhatsApp only opens after the admin clicks the button.
 */
export function NotifyWhatsapp({
  phone,
  businessName,
  enquiry,
  currentStatus,
}: {
  phone: string;
  businessName: string;
  enquiry: NotifyEnquiry;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const defaultMessage = useMemo(() => buildStatusMessage(status, businessName, enquiry), [status, businessName, enquiry]);
  const [message, setMessage] = useState(defaultMessage);
  const [edited, setEdited] = useState(false);

  function handleStatusChange(next: string) {
    setStatus(next);
    if (!edited) setMessage(buildStatusMessage(next, businessName, enquiry));
  }

  const href = whatsappLink(phone) + `?text=${encodeURIComponent(message)}`;

  return (
    <div className="rounded-sm border border-line bg-beige/40 p-5">
      <h3 className="text-lg text-charcoal">Notify customer on WhatsApp</h3>
      <p className="mt-1 text-sm text-stone">
        Choose what to tell the customer. You can change the words below before sending.
      </p>

      <div className="mt-4 max-w-xs">
        <Select
          aria-label="Message for"
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          {NOTIFY_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ENQUIRY_STATUS_LABELS[s] ?? s}
            </option>
          ))}
        </Select>
      </div>

      <Textarea
        aria-label="WhatsApp message"
        rows={4}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          setEdited(true);
        }}
        className="mt-3"
      />

      <Button asChild variant="whatsapp" className="mt-3">
        <a href={href} target="_blank" rel="noopener noreferrer">
          <MessageCircle aria-hidden="true" />
          Open WhatsApp with this message
        </a>
      </Button>
      <p className="mt-2 text-sm text-stone">
        This opens WhatsApp with the message ready. You still have to press send there.
      </p>
    </div>
  );
}
