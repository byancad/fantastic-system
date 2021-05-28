import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingsRepository } from './bookings.repository';
import { Bookings } from './bookings.entity';
import { CreateBookingDto } from './bookings.dto';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(BookingsRepository)
        private bookingsRepository: BookingsRepository,
      ) {}

    async getUserBookings(userId: string): Promise<Bookings[]> {
        return this.bookingsRepository.find({where: {userId}, order: {startTime: "ASC"}});
    }

    async getRoomBookings(roomId: number, date: Date): Promise<Bookings[]> {
        return this.bookingsRepository.getRoomBookingsByDate(roomId, date)
    }

    async createUserBooking(userId:string, createBookingDto: CreateBookingDto): Promise<void> {
        const {roomId, startTime}  = createBookingDto;
        const booking = await this.bookingsRepository.findOne({roomId, startTime})
        if (booking) {
            throw new ConflictException("Room is booked at this time");
        }
        return this.bookingsRepository.createBooking(userId, createBookingDto)
    }

    async deleteBooking(userId:string, bookingId: number): Promise<void> {
        const booking = await this.bookingsRepository.findOne({id:bookingId})
        if (!booking || !await booking.validateOwner(userId)) {
            throw new Error("Booking not found or owned by user")
        }

        await this.bookingsRepository.delete(booking.id);
    }
}
