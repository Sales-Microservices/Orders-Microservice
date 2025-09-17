import { Module } from '@nestjs/common';
import { OrdersService } from '../orders/services/orders.service';
import { OrdersController } from '../orders/controllers/orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, PRODUCT_SERVICE } from 'src/config';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    ClientsModule.register([
      {
        name: PRODUCT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.product_microservice_host,
          port: envs.product_microservice_port,
        }

      }
    ])
  ]
})
export class OrdersModule { }
