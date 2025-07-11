import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { VendorModule } from './vendor/vendor.module';
import { ProductModule } from './product/product.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [AuthModule, PrismaModule, VendorModule, ProductModule, RoleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
