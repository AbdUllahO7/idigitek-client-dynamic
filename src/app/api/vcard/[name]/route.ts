// app/vcard/[name]/route.js (App Router API Route)
// This will handle URLs like: /vcard/isa.vcf or /vcard/onur.vcf

import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

// Available VCF files mapping
const vcardFiles = {
  'isa': 'İsa_Alomer (1).vcf',
  'onur': 'onur.vcf', // if you have this file
  // Add more mappings as needed
};

export async function GET(request, { params }) {
  const { name } = params;
  
  // Remove .vcf extension if present
  const cleanName = name.replace('.vcf', '');
  
  // Check if the requested vcard exists
  if (!vcardFiles[cleanName]) {
    return new NextResponse('VCard not found', { status: 404 });
  }

  try {
    // Read the VCF file from public/assets
    const filePath = path.join(process.cwd(), 'public', 'assets', vcardFiles[cleanName]);
    const fileContent = await readFile(filePath, 'utf-8');

    // Return the VCF file with proper headers
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'text/vcard',
        'Content-Disposition': `attachment; filename="${cleanName}.vcf"`,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error reading VCF file:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}

// Alternative: For Pages Router (pages/api/vcard/[name].js)
/*
import fs from 'fs';
import path from 'path';

const vcardFiles = {
  'isa': 'İsa_Alomer (1).vcf',
  'onur': 'onur.vcf',
};

export default function handler(req, res) {
  const { name } = req.query;
  const cleanName = name.replace('.vcf', '');
  
  if (!vcardFiles[cleanName]) {
    return res.status(404).json({ error: 'VCard not found' });
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'assets', vcardFiles[cleanName]);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    res.setHeader('Content-Type', 'text/vcard');
    res.setHeader('Content-Disposition', `attachment; filename="${cleanName}.vcf"`);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    
    res.status(200).send(fileContent);
  } catch (error) {
    console.error('Error reading VCF file:', error);
    res.status(404).json({ error: 'File not found' });
  }
}
*/