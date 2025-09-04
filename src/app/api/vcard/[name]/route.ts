// File: app/api/vcard/[name]/route.ts
// Direct VCF serving that opens in contacts app

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const vcardFiles: Record<string, string> = {
  'isa': 'İsa_Alomer (1).vcf',
  'onur': 'onur.vcf',
};

interface RouteParams {
  params: {
    name: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { name } = params;
  const cleanName = name.replace('.vcf', '');
  
  if (!vcardFiles[cleanName]) {
    return NextResponse.redirect('https://idigitek.com');
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'assets', vcardFiles[cleanName]);
    const fileContent = await readFile(filePath, 'utf-8');

    // Serve VCF file directly to open in contacts app (not download)
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/vcard; charset=utf-8',
        // Remove Content-Disposition header to prevent download
        'Cache-Control': 'public, max-age=3600',
        // Add header to suggest opening instead of downloading
        'Content-Transfer-Encoding': '8bit',
      },
    });
  } catch (error) {
    return NextResponse.redirect('https://idigitek.com');
  }
}