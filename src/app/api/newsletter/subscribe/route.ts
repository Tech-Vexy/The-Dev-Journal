import { NextResponse } from 'next/server';
import axios from 'axios';

interface SubscribeRequest {
    email: string;
    name?: string;
}

interface ErrorResponse {
    error: string;
}

interface SuccessResponse {
    success: boolean;
    message: string;
}

export async function POST(request: Request): Promise<Response> {
    try {
        const { email, name }: SubscribeRequest = await request.json();

        // Basic validation
        if (!email || !email.includes('@')) {
            return NextResponse.json<ErrorResponse>(
                { error: 'Valid email is required' },
                { status: 400 }
            );
        }

        // Replace with your MailerLite API key and group ID
        const API_KEY: string | undefined = process.env.MAILERLITE_API_KEY;
        const GROUP_ID: string | undefined = process.env.MAILERLITE_GROUP_ID;
        
        // MailerLite API endpoint for adding subscribers
        const response = await axios.post(
            `https://api.mailerlite.com/api/v2/groups/${GROUP_ID}/subscribers`,
            {
                email,
                name: name || '',
                resubscribe: true,
            },
            {
                headers: {
                    'X-MailerLite-ApiKey': API_KEY,
                    'Content-Type': 'application/json',
                },
            }
        );

        return NextResponse.json<SuccessResponse>(
            { success: true, message: 'Successfully subscribed!' },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Newsletter subscription error:', error.response?.data || error.message);
        
        // Handle existing subscriber case
        if (error.response?.status === 409) {
            return NextResponse.json<ErrorResponse>(
                { error: 'You are already subscribed!' },
                { status: 409 }
            );
        }
        
        return NextResponse.json<ErrorResponse>(
            { error: 'Failed to subscribe. Please try again later.' },
            { status: 500 }
        );
    }
}