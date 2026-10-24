import { compressImageFile } from "@/lib/template-customizer-bridge";

type CloudinaryUploadResponse = {
  url?: unknown;
  error?: unknown;
};

export async function uploadImageToCloudinary(file: File): Promise<string> {
  if (file.size > 50 * 1024 * 1024) {
    throw new Error("Ảnh gốc vượt quá giới hạn 50 MB.");
  }

  let compressedDataUrl = await compressImageFile(file, 1600, 0.82);
  let compressedBlob = await fetch(compressedDataUrl).then((response) => response.blob());
  if (compressedBlob.size > 4 * 1024 * 1024) {
    compressedDataUrl = await compressImageFile(file, 1200, 0.68);
    compressedBlob = await fetch(compressedDataUrl).then((response) => response.blob());
  }
  if (compressedBlob.type !== "image/jpeg") {
    throw new Error("Không thể tối ưu ảnh này. Hãy thử ảnh JPEG, PNG hoặc WebP khác.");
  }
  if (compressedBlob.size > 4 * 1024 * 1024) {
    throw new Error("Ảnh sau khi tối ưu vẫn vượt quá giới hạn 4 MB.");
  }

  const formData = new FormData();
  formData.append("file", compressedBlob, "wedding-photo.jpg");

  const response = await fetch("/api/cloudinary/upload", {
    method: "POST",
    body: formData,
  });
  const result = (await response.json().catch(() => null)) as CloudinaryUploadResponse | null;

  if (!response.ok) {
    throw new Error(
      typeof result?.error === "string" ? result.error : "Không thể lưu ảnh lên Cloudinary. Vui lòng thử lại.",
    );
  }
  if (typeof result?.url !== "string" || !result.url.startsWith("https://res.cloudinary.com/")) {
    throw new Error("Cloudinary không trả về đường dẫn ảnh hợp lệ.");
  }

  return result.url;
}

export async function persistImageUrlToCloudinary(imageUrl: string): Promise<string> {
  if (!imageUrl.startsWith("data:image/")) return imageUrl;

  const response = await fetch(imageUrl);
  const blob = await response.blob();
  if (!blob.type.startsWith("image/")) {
    throw new Error("Không thể chuyển ảnh đã lưu cũ lên Cloudinary.");
  }

  return uploadImageToCloudinary(new File([blob], "wedding-photo", { type: blob.type }));
}
