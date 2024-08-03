import {
    Controller,
    Post,
    Put,
    Body,
    Param,
    Get,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IntegrationsService } from '../integrations/integrations.service';
import * as multer from 'multer';
import { SpeechClient, protos } from '@google-cloud/speech';

@Controller('conversations')
export class ConversationsController {
    constructor(private readonly integrationsService: IntegrationsService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('conversation', { storage: multer.memoryStorage() }))
    async handleUpload(@UploadedFile() file: Express.Multer.File) {
        try {
            // Instantiate the Google Cloud Speech client
            const client = new SpeechClient();

            // Convert the file buffer to a base64-encoded string
            const audioBytes = file.buffer.toString('base64');
            const audio: protos.google.cloud.speech.v1.RecognitionAudio = {
                content: audioBytes,
                toJSON() {
                    return { content: this.content };
                }
            };

            const config: protos.google.cloud.speech.v1.RecognitionConfig = {
                enableWordConfidence: false,
                model: "",
                useEnhanced: false,
                encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
                sampleRateHertz: 16000,
                languageCode: 'en-US',
                audioChannelCount: 1, // Optional properties with default values
                enableSeparateRecognitionPerChannel: false,
                alternativeLanguageCodes: [],
                maxAlternatives: 1,
                profanityFilter: false,
                speechContexts: [],
                enableWordTimeOffsets: false,
                enableAutomaticPunctuation: true,
                toJSON() {
                    return {
                        enableWordConfidence: this.enableWordConfidence,
                        model: this.model,
                        useEnhance: this.useEnhanced,
                        encoding: this.encoding,
                        sampleRateHertz: this.sampleRateHertz,
                        languageCode: this.languageCode,
                        audioChannelCount: this.audioChannelCount,
                        enableSeparateRecognitionPerChannel: this.enableSeparateRecognitionPerChannel,
                        alternativeLanguageCodes: this.alternativeLanguageCodes,
                        maxAlternatives: this.maxAlternatives,
                        profanityFilter: this.profanityFilter,
                        speechContexts: this.speechContexts,
                        enableWordTimeOffsets: this.enableWordTimeOffsets,
                        enableAutomaticPunctuation: this.enableAutomaticPunctuation
                    };
                }
            };

            const request: protos.google.cloud.speech.v1.RecognizeRequest = {
                audio: audio,
                config: config,
                toJSON() {
                    return {
                        audio: this.audio,
                        config: this.config
                    };
                }
            };

            // Perform speech recognition
            const [response] = await client.recognize(request);
            const transcription = response.results
                .map(result => result.alternatives[0].transcript)
                .join('\n');

            // Use OpenAI to analyze the conversation
            const extractedData = await this.integrationsService.analyzeConversation(transcription);

            // Generate suggestions for the sales manager
            const suggestions = await this.integrationsService.generateSuggestions(transcription);

            // Decide on the operation based on extracted data
            const salesforceResponse = await this.integrationsService.createLead({
                LastName: 'Doe',
                Company: 'Acme Corp',
                Description: extractedData,
            });

            // Optionally create a note with the suggestions
            const noteResponse = await this.integrationsService.createNote(
                (salesforceResponse as any).id,
                'Conversation Suggestions',
                suggestions
            );

            return {
                message: 'Data submitted to Salesforce successfully!',
                salesforceResponse,
                noteResponse,
                suggestions,
            };
        } catch (error) {
            console.error(error);
            return { error: 'An error occurred while processing the request.' };
        }
    }

    @Post('lead')
    async createLead(@Body() data: any) {
        const response = await this.integrationsService.createLead(data);
        return response;
    }

    @Post('contact')
    async createContact(@Body() data: any) {
        const response = await this.integrationsService.createContact(data);
        return response;
    }

    @Put('contact/:id')
    async updateContact(@Param('id') contactId: string, @Body() data: any) {
        const response = await this.integrationsService.updateContact(contactId, data);
        return response;
    }

    @Post('account')
    async createAccount(@Body() data: any) {
        const response = await this.integrationsService.createAccount(data);
        return response;
    }

    @Put('account/:id')
    async updateAccount(@Param('id') accountId: string, @Body() data: any) {
        const response = await this.integrationsService.updateAccount(accountId, data);
        return response;
    }

    @Post('opportunity')
    async createOpportunity(@Body() data: any) {
        const response = await this.integrationsService.createOpportunity(data);
        return response;
    }

    @Put('opportunity/:id')
    async updateOpportunity(@Param('id') opportunityId: string, @Body() data: any) {
        const response = await this.integrationsService.updateOpportunity(opportunityId, data);
        return response;
    }

    @Post('task')
    async createTask(@Body() data: any) {
        const response = await this.integrationsService.createTask(data);
        return response;
    }

    @Put('task/:id')
    async updateTask(@Param('id') taskId: string, @Body() data: any) {
        const response = await this.integrationsService.updateTask(taskId, data);
        return response;
    }

    @Get('query')
    async querySalesforce(@Query('q') query: string) {
        const response = await this.integrationsService.querySalesforce(query);
        return response;
    }
}
