import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IntegrationsService } from './integrations/integrations.service';
import { ConversationsController } from './conversations/conversations.controller';

@Module({
  imports: [],
  controllers: [AppController, ConversationsController],
  providers: [AppService, IntegrationsService],
})
export class AppModule {}
