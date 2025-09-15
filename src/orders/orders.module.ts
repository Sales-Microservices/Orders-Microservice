import { Module } from '@nestjs/common';
import { OrdersService } from '../orders/services/orders.service';
import { OrdersController } from '../orders/controllers/orders.controller';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
