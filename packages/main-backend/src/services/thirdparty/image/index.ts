import sharp from "sharp";
import fs from "fs";
import { configuration } from "config";
import { logger } from "services/logger";
import { ServiceResponse } from "@vps/utils/lib/data";
import { ImageError } from "@vps/utils/lib/dto/thirdparty/image";

const allowFileMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png"
];

// Allowed file size in mb
const allowedFileSize = 4;

const processImage = async (
  file : Express.Multer.File,
  width ? : number,
  height ? : number
) : Promise<ServiceResponse<string, ImageError>> => {
  if (!file || !file.buffer) return { error : ImageError.FileNotFound };

  if (!allowFileMimeTypes.includes(file.mimetype)) {
    return { error : ImageError.MimeError };
  }

  if ((file.size / (1024 * 1024)) > allowedFileSize) {
    return { error : ImageError.FileSizeError };
  }

  const nowMilli = new Date().valueOf();
  const fileName = "image-" + nowMilli + ".jpg";
  const fileUrl = "/uploads/" + fileName;
  try {
    const jpegSharp = await sharp(file.buffer).jpeg({ mozjpeg : true });
    const imageBuf = await jpegSharp.resize({
      width : width || 400,
      height : height || 400,
      fit : "inside"
    }).toBuffer();

    const filePath = configuration.uploadFilePath + fileUrl;
    await fs.writeFileSync(filePath, imageBuf);
  } catch (e) {
    logger.error("[services/thirdparty/image] Saving Image failed: " + e.toString());
    return { error : ImageError.FileSavingFail };
  }

  return { data : fileUrl };
};

export { processImage };
