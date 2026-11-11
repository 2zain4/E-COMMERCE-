import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/users/user.module';
import { ProductsModule } from './module/products/products.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './module/auth/auth.module';
import { BrandsModule } from './module/brands/brands.module';
import { CategoriesModule } from './module/categories/categories.module';
import { CartModule } from './module/cart/cart.module';
import { WishlistModule } from './module/wishlist/wishlist.module';
import { OrdersModule } from './module/orders/orders.module';
import { TransactionsModule } from './module/transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env.dev', '.env.prod'] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DB_CONNECTION_URL'),
        onConnectionCreate: () => {
          console.log('✅ Database Connected Successfully');
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ProductsModule,
    AuthModule,
    BrandsModule,
    CategoriesModule,
    CartModule,
    WishlistModule,
    OrdersModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
