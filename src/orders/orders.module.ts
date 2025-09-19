import { Module } from '@nestjs/common';
import { OrdersService } from '../orders/services/orders.service';
import { OrdersController } from '../orders/controllers/orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, NATS_SERVICES, } from 'src/config';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [NatsModule]
})
export class OrdersModule { }
