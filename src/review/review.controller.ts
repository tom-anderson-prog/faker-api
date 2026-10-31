import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtGuard } from 'src/guard/jwt.guard';
import type { Request } from 'express';
import type { ReviewCreateInput } from 'generated/prisma/models';

@Controller('reviews')
@UseGuards(JwtGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Body() createReviewDto: ReviewCreateInput, @Req() req: Request) {
    const { sub, username } = req.user!;
    console.log(req);

    return this.reviewService.create(sub, username, createReviewDto);
  }
}
