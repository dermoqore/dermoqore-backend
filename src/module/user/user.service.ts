import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAllCustomers(page = 1, limit = 20, search?: string) {
    return this.userRepository.findAllCustomers(page, limit, search);
  }

  async findOneCustomer(id: string) {
    const user = await this.userRepository.findOneCustomer(id);
    if (!user) throw new NotFoundException('Customer not found');
    return user;
  }
}
