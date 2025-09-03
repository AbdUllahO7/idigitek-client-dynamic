'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const CONTACTS = {
  isa: {
    fullName: "İsa Alomer",
    firstName: "İsa",
    lastName: "Alomer",
    organization: "iDIGITEK",
    title: "Operations Manager",
    phone: "+905317324731",
    email: "services@idigitek.com",
    website: "www.idigitek.com",
  },
};

export default function VCardPage() {
  const params = useParams();
  const router = useRouter();
  const name = params.name as string;

  useEffect(() => {
    if (!name) {
      // Redirect to idigitek.com if no name
      window.location.href = 'https://idigitek.com';
      return;
    }

    const contact = CONTACTS[name.toLowerCase() as keyof typeof CONTACTS];
    if (!contact) {
      // Redirect to idigitek.com if contact not found
      window.location.href = 'https://idigitek.com';
      return;
    }

    const doDownload = () => {
      // Create vCard content
      const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.fullName}
N:${contact.lastName};${contact.firstName};;;
ORG:${contact.organization}
TITLE:${contact.title}
TEL;TYPE=CELL:${contact.phone}
EMAIL;TYPE=HOME:${contact.email}
URL:https://${contact.website}
END:VCARD`;

      // Create and trigger download
      const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${contact.firstName}_${contact.lastName}.vcf`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Handle mobile intents
      const ua = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) {
        setTimeout(() => {
          try {
            window.location.href = 'contacts://';
          } catch (e) {
            console.error('iOS contacts intent failed:', e);
          }
        }, 500);
      } else if (/android/.test(ua)) {
        setTimeout(() => {
          try {
            window.location.href =
              'intent://contacts/#Intent;action=android.intent.action.VIEW;package=com.android.contacts;end';
          } catch (e) {
            console.error('Android contacts intent failed:', e);
          }
        }, 500);
      }

      // Redirect to idigitek.com after download
      setTimeout(() => {
        window.location.href = 'https://idigitek.com';
      }, 2000);
    };

    // Start download after component mounts
    const timer = setTimeout(doDownload, 1000);
    
    return () => clearTimeout(timer);
  }, [name]);

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm mb-2">Downloading contact...</p>
        <p className="text-gray-400 text-xs">You will be redirected to idigitek.com</p>
      </div>
    </div>
  );
}