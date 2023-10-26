import {
  Post,
  Route,
  Tags,
  UploadedFile
} from "tsoa";

@Route("file")
@Tags("File")
export default class FileController {

    @Post("image")
  public async uploadImage(@UploadedFile() file: unknown): Promise<string> {
    return "string";
  }

}