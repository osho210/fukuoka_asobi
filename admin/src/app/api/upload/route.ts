import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname, basename } from 'path';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false, error: 'No file found' });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ファイル名を一意にするためにタイムスタンプを付与
    const sanitizedFileName = basename(file.name);
    const fileName = `${Date.now()}-${sanitizedFileName}`;
    const filePath = join(process.cwd(), '..', 'frontend', 'public', 'images', 'foods', fileName);

    try {
        await mkdir(dirname(filePath), { recursive: true });
        await writeFile(filePath, buffer);
        console.log(`File saved to ${filePath}`);
        // publicディレクトリからの相対パスを返す
        const publicPath = fileName;
        return NextResponse.json({ success: true, fileName: publicPath });
    } catch (error) {
        console.error('Error saving file:', error);
        return NextResponse.json({ success: false, error: 'Error saving file' });
    }
}
