import { randomUUID } from "node:crypto";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_REQUEST_BYTES = MAX_IMAGE_BYTES + 64 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function hasValidImageSignature(type: string, buffer: Buffer) {
  if (type === "image/jpeg") {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (type === "image/png") {
    return (
      buffer.length >= 8 &&
      buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    );
  }

  if (type === "image/webp") {
    return buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  }

  return false;
}

function uploadImage(buffer: Buffer, publicId: string): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "kismet/user-uploads",
        public_id: publicId,
        overwrite: false,
        use_filename: false,
        unique_filename: false,
        tags: ["kismet-user-upload"],
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          reject(new Error("Cloudinary returned an empty upload response"));
          return;
        }
        resolve(result);
      },
    );

    stream.on("error", reject);
    stream.end(buffer);
  });
}

export async function POST(request: Request) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary chưa được cấu hình trên máy chủ. Vui lòng thêm đủ CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY và CLOUDINARY_API_SECRET." },
      { status: 503 },
    );
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "Ảnh sau khi tối ưu vượt quá giới hạn 4 MB." }, { status: 413 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Không đọc được dữ liệu ảnh tải lên." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Thiếu file ảnh." }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "File ảnh đang trống." }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Ảnh sau khi tối ưu vượt quá giới hạn 4 MB." }, { status: 413 });
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type.toLowerCase())) {
    return NextResponse.json({ error: "Chỉ hỗ trợ ảnh JPEG, PNG hoặc WebP." }, { status: 415 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!hasValidImageSignature(file.type.toLowerCase(), buffer)) {
    return NextResponse.json({ error: "File không phải ảnh hợp lệ hoặc định dạng chưa được hỗ trợ." }, { status: 415 });
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  try {
    const uploaded = await uploadImage(buffer, `photo-${randomUUID()}`);
    const url = cloudinary.url(uploaded.public_id, {
      secure: true,
      version: uploaded.version,
      transformation: [
        { width: 1600, height: 1600, crop: "limit" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error("Cloudinary image upload failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Không thể lưu ảnh lên Cloudinary. Vui lòng thử lại." }, { status: 502 });
  }
}
