import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(userId: string, message: string) {
    const notification = this.notificationRepository.create({
      user_id: userId,
      message,
    });
    return this.notificationRepository.save(notification);
  }

  async findAllForUser(userId: string) {
    return this.notificationRepository.find({
      where: { user_id: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string) {
    await this.notificationRepository.update(id, { read: true });
    return { success: true };
  }
}