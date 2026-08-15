import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateWhatsAppMessage(data: {
  name: string;
  category?: string;
  design?: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  message?: string;
  whatsappNumber: string;
}): string {
  const encodedMessage = encodeURIComponent(
    `Hi AR Decor,

I am interested in booking this decoration.

${data.category ? `Category: ${data.category}` : ''}
${data.design ? `Design: ${data.design}` : ''}
${data.eventDate ? `Event Date: ${data.eventDate}` : ''}
${data.eventTime ? `Event Time: ${data.eventTime}` : ''}
${data.location ? `Event Location: ${data.location}` : ''}
${data.message ? `Message: ${data.message}` : ''}

Please share availability and pricing.`
  );

  return `https://wa.me/91${data.whatsappNumber}?text=${encodedMessage}`;
}

export function openWhatsApp(url: string) {
  window.open(url, '_blank');
}
