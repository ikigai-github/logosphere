import { diskStorage } from 'multer';
import { Res, Param, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PinataService } from '@logosphere/ipfs'; 
import { editFileName } from './edit-file-name.util';

@Controller('ipfs')
export class IpfsController {
  constructor(private client: PinataService) {}

  @Get()
  public async testAuthentication(): Promise<boolean> {
    return await this.client.testAuthentication();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
    destination: './files',
    filename: editFileName,
  })}))
  public async uploadFile(@UploadedFile() file) {
    try {
      const response = await this.client.uploadFile(`./files/${file.filename}`);
      return  {
        originalFileName: file.originalname,
        filename: file.filename,
        ipfsCid: response.IpfsHash
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
    }
  }

  @Get(':imgpath')
  seeUploadedFile(@Param('filepath') file, @Res() res) {
    return res.sendFile(file, { root: './files' });
  }

}
