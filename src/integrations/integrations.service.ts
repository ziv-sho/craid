import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import * as jsforce from 'jsforce';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class IntegrationsService {
    private openai: OpenAI;
    private salesforce: jsforce.Connection;
    private sessionInfo: jsforce.UserInfo | null = null;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        this.salesforce = new jsforce.Connection({
            loginUrl: process.env.SALESFORCE_LOGIN_URL,
        });
    }

    private async loginToSalesforce() {
        this.sessionInfo = await this.salesforce.login(
            process.env.SALESFORCE_USERNAME,
            process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_TOKEN,
        );
    }

    private async ensureLoggedIn() {
        if (!this.salesforce.accessToken || !this.salesforce.instanceUrl) {
            await this.loginToSalesforce();
        }
    }

    async analyzeConversation(transcription: string): Promise<string> {
        const response = await this.openai.completions.create({
            model: 'text-davinci-003',
            prompt: `Analyze the following conversation and extract relevant data for Salesforce CRM:\n\n${transcription}`,
            max_tokens: 150,
        });
        return response.choices[0].text.trim();
    }

    async generateSuggestions(transcription: string): Promise<string> {
        const response = await this.openai.completions.create({
            model: 'text-davinci-003',
            prompt: `Based on the following conversation, generate suggestions for things to say to the sales manager:\n\n${transcription}`,
            max_tokens: 150,
        });
        return response.choices[0].text.trim();
    }

    async createNote(parentId: string, noteTitle: string, noteBody: string) {
        await this.ensureLoggedIn();
        const response = await this.salesforce.sobject('Note').create({
            ParentId: parentId,
            Title: noteTitle,
            Body: noteBody,
        });
        return response;
    }

    // Lead Operations
    async createLead(data: any) {
        await this.ensureLoggedIn();
        const response = await this.salesforce.sobject('Lead').create(data);
        return response;
    }

    // Contact Operations
    async createContact(data: any) {
        await this.ensureLoggedIn();
        const response = await this.salesforce.sobject('Contact').create(data);
        return response;
    }

    async updateContact(contactId: string, data: any) {
        await this.ensureLoggedIn();
        const response = await this.salesforce.sobject('Contact').update({
            Id: contactId,
            ...data,
        });
        return response;
    }

    // Account Operations
    async createAccount(data: any) {
        await this.ensureLoggedIn();
        const response = await this.salesforce.sobject('Account').create(data);
        return response;
    }

    async updateAccount(accountId: string, data: any) {
        await this.ensureLoggedIn();
        const response = await this.salesforce.sobject('Account').update({
            Id: accountId,
            ...data,
        });
        return response;
    }

    // Opportunity Operations
    async createOpportunity(data: any) {
        await this.ensureLoggedIn();
        const response = await this.salesforce.sobject('Opportunity').create(data);
        return response;
    }

    async updateOpportunity(opportunityId: string, data: any) {
        await this.ensureLoggedIn();
        const response = await this.salesforce.sobject('Opportunity').update({
            Id: opportunityId,
            ...data,
        });
        return response;
    }

    // Task Operations
    async createTask(data: any) {
        await this.ensureLoggedIn();
        const response = await this.salesforce.sobject('Task').create(data);
        return response;
    }

    async updateTask(taskId: string, data: any) {
        await this.ensureLoggedIn();
        const response = await this.salesforce.sobject('Task').update({
            Id: taskId,
            ...data,
        });
        return response;
    }

    // Query Operations
    async querySalesforce(query: string) {
        await this.ensureLoggedIn();
        const response = await this.salesforce.query(query);
        return response.records;
    }
}
