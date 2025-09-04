// File: app/api/vcard/[name]/route.ts
// This handles URLs like: /api/vcard/isa.vcf OR /api/vcard/isa

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

// Available VCF files mapping
const vcardFiles: Record<string, string> = {
  'isa': 'İsa_Alomer (1).vcf',
  'onur': 'onur.vcf', // add your other files
  // Add more mappings as needed
};

interface RouteParams {
  params: {
    name: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { name } = params;
  
  // Remove .vcf extension if present
  const cleanName = name.replace('.vcf', '');
  
  // Check if the requested vcard exists
  if (!vcardFiles[cleanName]) {
    return new NextResponse('VCard not found', { 
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      }
    });
  }

  try {
    // Read the VCF file from public/assets
    const filePath = path.join(process.cwd(), 'public', 'assets', vcardFiles[cleanName]);
    const fileContent = await readFile(filePath, 'utf-8');

    // Return the VCF file with proper headers for download
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/vcard; charset=utf-8',
        'Content-Disposition': `attachment; filename="${cleanName}.vcf"`,
        'Cache-Control': 'no-cache', // Change this for production caching if needed
        'Access-Control-Allow-Origin': '*', // Add CORS if needed
      },
    });
  } catch (error) {
    console.error('Error reading VCF file:', error);
    return new NextResponse(`File not found: ${error}`, { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      }
    });
  }
}