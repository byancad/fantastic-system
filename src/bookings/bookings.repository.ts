import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import { CreateBookingDto } from './bookings.dto';
import { Bookings } from './bookings.entity';

@EntityRepository(Bookings)
export class BookingsRepository extends Repository<Bookings>{
    async createBooking(userId: string, createBookingDto: CreateBookingDto): Promise<void> {
        const {roomId, startTime, stopTime} = createBookingDto;
        const newBooking = new Bookings();
        newBooking.roomId = roomId;
        newBooking.startTime = startTime;
        newBooking.stopTime = stopTime;
        newBooking.userId = userId;
        await newBooking.save();
    }

    async getRoomBookingsByDate(roomId: number, date: Date): Promise<Bookings[]> {
        const query = this.createQueryBuilder('bookings');
        query.andWhere('Date(\"startTime\") = :date',  date);
        query.orderBy('\"startTime\"')
        return await query.getMany();
    }
}