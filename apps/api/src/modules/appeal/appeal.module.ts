import { Module } from '@nestjs/common';
import { AppealController } from './appeal.controller';
import { AppealService } from './appeal.service';

@Module({
    controllers: [AppealController],
    providers: [AppealService],
    exports: [AppealService],
})
export class AppealModule { }
