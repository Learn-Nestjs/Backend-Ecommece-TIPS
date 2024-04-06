// import { authenticate } from '@google-cloud/local-auth';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { google } from 'googleapis';
import { docs_v1 } from '@googleapis/docs';

@Injectable()
export class GoogleAuth {
  private Docs: docs_v1.Docs;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, '../../credentials.json'),
      scopes: 'https://www.googleapis.com/auth/documents',
    });
    this.Docs = google.docs({ version: 'v1', auth });
  }

  async writeLogToDocs(content: string) {
    if (!process.env.GG_DOCUMENT_ID) return;
    await this.Docs.documents.batchUpdate({
      documentId: process.env.GG_DOCUMENT_ID,
      requestBody: {
        requests: [
          {
            insertText: {
              location: {
                index: 1,
              },
              text: `${content}\n`,
            },
          },
        ],
      },
    });
  }
}
