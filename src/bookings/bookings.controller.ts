import { Controller, Get, HttpCode, UseGuards, Req, Post, Body, Delete, Param } from '@nestjs/common';
import { Bookings } from './bookings.entity';
import { BookingsService } from './bookings.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateBookingDto } from './bookings.dto';


@Controller('bookings')
@UseGuards(AuthGuard())
export class BookingsController {
    constructor(private bookingsService: BookingsService) {}

    @Get()
    @HttpCode(200)
    userBookings(@Req() req): Promise<Bookings[]> {
      return this.bookingsService.getUserBookings(req.user.id);
    }

    @Get('/:roomId')
    @HttpCode(200)
    roomBookings(@Param('roomId') roomId: number, @Body() date: Date): Promise<Bookings[]> {
      return this.bookingsService.getRoomBookings(roomId, date);
    }

    @Post()
    @HttpCode(201)
    createBooking(@Req() req, @Body() createBookingDto: CreateBookingDto): Promise<void> {
        return this.bookingsService.createUserBooking(req.user.id, createBookingDto);
    }

    @Delete('/:bookingId')
    @HttpCode(204)
    deleteBooking(@Req() req, @Param('bookingId') bookingId: number): Promise<void>{
        return this.bookingsService.deleteBooking(req.user.id, bookingId);
    }
}
