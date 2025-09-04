// pages/download-contact.js (or app/download-contact/page.js for App Router)
'use client'; // Only needed if using App Router

import { useEffect } from 'react';
import { useRouter } from 'next/router'; // For Pages Router
// import { useRouter } from 'next/navigation'; // For App Router

const DownloadContactPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Create direct download link to the VCF file in public folder
    const link = document.createElement('a');
    link.href = '/İsa_Alomer (1).vcf'; // Direct path to file in public folder
    link.download = 'İsa_Alomer.vcf'; // Clean filename for download
    link.style.display = 'none';
    
    // Add to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Redirect to home page after a short delay
    const timer = setTimeout(() => {
      router.push('/');
    }, 1000); // 1 second delay to ensure download starts
    
    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [router]);

  // Return minimal loading UI
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <p>Downloading contact...</p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Redirecting to home page...
        </p>
      </div>
    </div>
  );
};

export default DownloadContactPage;