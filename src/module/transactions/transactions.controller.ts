import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';
import { RoleEnum } from '../../common/enum/role.enum';
import { CurrentUser } from '../../common/decorator/current-user.decorator';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  createTransaction(
    @Body(new ValidationPipe()) createTransactionDto: CreateTransactionDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.transactionsService.createTransaction(
      userId,
      createTransactionDto,
    );
  }

  @Get('my-transactions')
  getUserTransactions(@CurrentUser('id') userId: string) {
    return this.transactionsService.getUserTransactions(userId);
  }

  @Get('all-transactions')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  getAllTransactions() {
    return this.transactionsService.getAllTransactions();
  }
}
