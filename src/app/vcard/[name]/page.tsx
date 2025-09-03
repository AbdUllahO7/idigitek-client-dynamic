'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  const [isAndroid, setIsAndroid] = useState(false);
  const [contact, setContact] = useState(null);

  useEffect(() => {
    if (!name) {
      window.location.href = 'https://idigitek.com';
      return;
    }

    const contactData = CONTACTS[name.toLowerCase() as keyof typeof CONTACTS];
    if (!contactData) {
      window.location.href = 'https://idigitek.com';
      return;
    }

    setContact(contactData);
    const ua = navigator.userAgent.toLowerCase();
    const isAndroidDevice = /android/.test(ua);
    setIsAndroid(isAndroidDevice);

    if (!isAndroidDevice) {
      // iOS - use the original VCF download method
      const doDownload = () => {
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contactData.fullName}
N:${contactData.lastName};${contactData.firstName};;;
ORG:${contactData.organization}
TITLE:${contactData.title}
TEL;TYPE=CELL:${contactData.phone}
EMAIL;TYPE=HOME:${contactData.email}
URL:https://${contactData.website}
END:VCARD`;

        const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${contactData.firstName}_${contactData.lastName}.vcf`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setTimeout(() => {
          try {
            window.location.href = 'contacts://';
          } catch (e) {
            console.error('iOS contacts intent failed:', e);
          }
        }, 500);

        setTimeout(() => {
          window.location.href = 'https://idigitek.com';
        }, 2000);
      };

      const timer = setTimeout(doDownload, 1000);
      return () => clearTimeout(timer);
    }
  }, [name]);

  const handleAndroidAction = (action, value) => {
    switch (action) {
      case 'call':
        window.location.href = `tel:${value}`;
        break;
      case 'sms':
        window.location.href = `sms:${value}`;
        break;
      case 'email':
        window.location.href = `mailto:${value}`;
        break;
      case 'website':
        window.open(`https://${value}`, '_blank');
        break;
      case 'addContact':
        // Try multiple methods to add contact on Android
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

        // Method 1: Try Web Share API if available
        if (navigator.share) {
          const blob = new Blob([vcard], { type: 'text/vcard' });
          const file = new File([blob], `${contact.firstName}_${contact.lastName}.vcf`, { type: 'text/vcard' });
          
          navigator.share({
            files: [file],
            title: `Add ${contact.fullName} to contacts`
          }).catch(err => {
            console.log('Web Share failed, falling back to download:', err);
            downloadVCard();
          });
        } else {
          downloadVCard();
        }

        function downloadVCard() {
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

          // Try Android contact intent
          setTimeout(() => {
            try {
              window.location.href = 'intent://contacts/people/#Intent;action=android.intent.action.VIEW;end';
            } catch (e) {
              console.error('Android intent failed:', e);
            }
          }, 500);
        }
        break;
    }
  };

  if (isAndroid && contact) {
    return (
      <div className="fixed inset-0 bg-gray-100 overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <button 
            onClick={() => window.location.href = 'https://idigitek.com'}
            className="text-white font-medium"
          >
            Done
          </button>
          <button 
            onClick={() => handleAndroidAction('addContact')}
            className="bg-white bg-opacity-20 px-3 py-1 rounded text-sm font-medium"
          >
            Add Contact
          </button>
        </div>

        {/* Profile Section */}
        <div className="bg-blue-600 text-white text-center pb-8">
          <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-gray-600 text-3xl font-light">
              {contact.firstName.charAt(0)}
            </span>
          </div>
          <div className="text-sm opacity-80 mb-1">{contact.title} • {contact.organization}</div>
          <h1 className="text-2xl font-light">{contact.fullName}</h1>
        </div>

        {/* Action Buttons */}
        <div className="bg-white mx-4 -mt-4 rounded-lg shadow-lg p-4 mb-4">
          <div className="grid grid-cols-4 gap-4">
            <button 
              onClick={() => handleAndroidAction('sms', contact.phone)}
              className="flex flex-col items-center p-3 rounded-lg bg-gray-50"
            >
              <div className="w-8 h-8 mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
              </div>
              <span className="text-xs font-medium">message</span>
            </button>

            <button 
              onClick={() => handleAndroidAction('call', contact.phone)}
              className="flex flex-col items-center p-3 rounded-lg bg-gray-50"
            >
              <div className="w-8 h-8 mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </div>
              <span className="text-xs font-medium">call</span>
            </button>

            <button className="flex flex-col items-center p-3 rounded-lg bg-gray-50 opacity-50">
              <div className="w-8 h-8 mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
              </div>
              <span className="text-xs font-medium">video</span>
            </button>

            <button 
              onClick={() => handleAndroidAction('email', contact.email)}
              className="flex flex-col items-center p-3 rounded-lg bg-gray-50"
            >
              <div className="w-8 h-8 mb-2 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <span className="text-xs font-medium">mail</span>
            </button>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white mx-4 rounded-lg shadow-lg overflow-hidden">
          <div 
            onClick={() => handleAndroidAction('call', contact.phone)}
            className="flex items-center p-4 border-b border-gray-100 active:bg-gray-50"
          >
            <div className="flex-1">
              <div className="text-gray-500 text-sm">mobile</div>
              <div className="text-blue-600 font-medium">{contact.phone}</div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z"/>
            </svg>
          </div>

          <div 
            onClick={() => handleAndroidAction('email', contact.email)}
            className="flex items-center p-4 border-b border-gray-100 active:bg-gray-50"
          >
            <div className="flex-1">
              <div className="text-gray-500 text-sm">home</div>
              <div className="text-blue-600 font-medium">{contact.email}</div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z"/>
            </svg>
          </div>

          <div 
            onClick={() => handleAndroidAction('website', contact.website)}
            className="flex items-center p-4 active:bg-gray-50"
          >
            <div className="flex-1">
              <div className="text-gray-500 text-sm">homepage</div>
              <div className="text-blue-600 font-medium">https://{contact.website}</div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z"/>
            </svg>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-3">
          <button 
            onClick={() => handleAndroidAction('addContact')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
          >
            Create New Contact
          </button>
          
          <button 
            onClick={() => handleAndroidAction('addContact')}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium"
          >
            Add to Existing Contact
          </button>
        </div>

        {/* Footer */}
        <div className="h-8"></div>
        <div className="fixed bottom-0 left-0 right-0 h-1 bg-white"></div>
      </div>
    );
  }

  // Loading state for iOS or while contact is loading
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">Loading contact...</p>
        <p className="text-gray-400 dark:text-gray-500 text-xs">You will be redirected to idigitek.com</p>
      </div>
    </div>
  );
}