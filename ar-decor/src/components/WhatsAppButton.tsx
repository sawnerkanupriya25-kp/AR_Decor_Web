'use client';

import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { generateWhatsAppMessage, openWhatsApp } from '@/lib/utils';

export default function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState('8269037288');

  useEffect(() => {
    fetch('/api/settings?key=whatsapp_number')
      .then(res => res.json())
      .then(data => {
        if (data.value) setWhatsappNumber(data.value);
      })
      .catch(console.error);
  }, []);

  const handleWhatsAppClick = () => {
    const url = generateWhatsAppMessage({
      name: '',
      message: 'Hi AR Decor, I would like to enquire about your event decoration services.',
      whatsappNumber,
    });
    openWhatsApp(url);
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20BA5A] transition-all duration-300 hover:scale-110 flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={32} />
    </button>
  );
}
