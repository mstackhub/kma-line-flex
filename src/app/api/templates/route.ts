import { NextResponse } from 'next/server';
import { getTemplates, saveCustomTemplate } from '@/lib/storage';
import { Template } from '@/types/message';
import { nanoid } from 'nanoid';

export async function GET() {
  try {
    const templates = getTemplates();
    return NextResponse.json(templates);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newTemplate: Template = {
      ...body,
      id: body.id || `tpl-custom-${nanoid(6)}`,
      isBuiltIn: false,
      createdAt: new Date().toISOString(),
    };

    const saved = saveCustomTemplate(newTemplate);
    return NextResponse.json(saved, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
