import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';
import { RoleEnum } from '../../common/enum/role.enum';
import { CurrentUser } from '../../common/decorator/current-user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(
    @Body(new ValidationPipe()) createOrderDto: CreateOrderDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.ordersService.createOrder(userId, createOrderDto);
  }

  @Get('my-orders')
  getUserOrders(@CurrentUser('id') userId: string) {
    return this.ordersService.getUserOrders(userId);
  }

  @Get('all-orders')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string, @CurrentUser() currentUser: any) {
    const order = await this.ordersService.getOrderById(id);
    if (
      currentUser.role !== RoleEnum.ADMIN &&
      order.userId.toString() !== currentUser.id
    ) {
      throw new UnauthorizedException(
        'You do not have permission to view this order',
      );
    }
    return order;
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  updateOrderStatus(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, updateOrderStatusDto);
  }
}
