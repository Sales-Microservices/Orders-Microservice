import { Injectable, Logger, Inject } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { PrismaClient } from '@prisma/client';
import { OnModuleInit, HttpStatus } from '@nestjs/common';
import { RpcException, ClientProxy } from '@nestjs/microservices';
import { OrderPaginationDto, ChangeOrderStatusDto } from '../dto';
import { PRODUCT_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';



@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('Orders Service')
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {
    super()
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database is Connected ...')
  }

  async create(createOrderDto: CreateOrderDto) {

    const ids = createOrderDto.items.map(item => item.productId)

    const products = firstValueFrom(
      this.productsClient.send('validateIds', ids)
    )
    return products;
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {

    const totalPages = await this.order.count({
      where: {
        status: orderPaginationDto.status
      }
    });

    const currentPage: any = orderPaginationDto.page;
    const perPage: any = orderPaginationDto.limit;


    return {
      data: await this.order.findMany({
        skip: (currentPage - 1) * perPage,
        take: perPage,
        where: {
          status: orderPaginationDto.status
        }
      }),
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages / perPage)
      }
    }
  }

  async findOne(id: string) {

    const order = await this.order.findFirst({
      where: { id }
    });

    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`
      });
    }

    return order;

  }

  async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {

    const { id, status } = changeOrderStatusDto;

    const order = await this.findOne(id);
    if (order.status === status) {
      return order;
    }

    return this.order.update({
      where: { id },
      data: { status: status }
    });

  }


}
