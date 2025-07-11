import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { user } from 'generated/prisma';
import { QueryParamsDto } from 'src/common/dto/query-params.dto';

interface RequestWithUser extends ExpressRequest {
  user: user;
}

@UseGuards(JwtAuthGuard)
@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  create(@Request() req: RequestWithUser, @Body() createVendorDto: CreateVendorDto) {
    const user_id: number = req.user.id;
    console.log(user_id);
    return this.vendorService.create(user_id, createVendorDto);
  }

  @Get()
  findAll(@Query() query: QueryParamsDto) {
    return this.vendorService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorService.update(+id, updateVendorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorService.remove(+id);
  }
}
