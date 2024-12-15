import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const PREDICTION_TIMEOUT = 10000; // 10 seconds

async function waitForPrediction(replicate: Replicate, id: string): Promise<any> {
  const startTime = Date.now();
  
  while (true) {
    const prediction = await replicate.predictions.get(id);
    
    if (prediction.status === 'succeeded') {
      return prediction;
    }
    
    if (prediction.status === 'failed') {
      throw new Error((prediction.error as string) || 'Prediction failed');
    }
    
    if (Date.now() - startTime > PREDICTION_TIMEOUT) {
      throw new Error('Prediction timeout');
    }
    
    // Wait for 1 second before checking again
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('REPLICATE_API_TOKEN is not configured');
    }

    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image data provided' },
        { status: 400 }
      );
    }

    // Validate base64 image size
    const sizeInBytes = Buffer.from(image, 'base64').length;
    if (sizeInBytes > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Image size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Create a proper data URL for the image
    const imageUrl = `data:image/jpeg;base64,${image}`;

    console.log('Creating prediction...');
    const prediction = await replicate.predictions.create({
      version: "7de2ea26c616d5bf2245ad0d5e24f0ff9a6204578a5c876db53142edd9d2cd56",
      input: {
        image: imageUrl,
        codeformer_fidelity: 0.7,
        background_enhance: true,
        face_upsample: true,
        upscale: 2,
      },
    });

    console.log('Waiting for prediction...', prediction.id);
    const result = await waitForPrediction(replicate, prediction.id);
    console.log('Prediction completed:', result);

    if (!result.output) {
      throw new Error('No output received from Replicate API');
    }

    // Get the output URL from the prediction
    const outputUrl = Array.isArray(result.output) ? result.output[0] : result.output;

    // Validate the URL
    try {
      new URL(outputUrl);
    } catch (e) {
      console.error('Invalid URL from Replicate:', outputUrl);
      throw new Error('Invalid URL received from Replicate API');
    }

    return NextResponse.json({ 
      success: true, 
      output: outputUrl
    });
  } catch (error) {
    console.error('Replicate API error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API token')) {
        return NextResponse.json(
          { success: false, error: 'API configuration error' },
          { status: 500 }
        );
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { success: false, error: 'API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { success: false, error: 'Processing took too long. Please try again.' },
          { status: 504 }
        );
      }
      // Return the actual error message for debugging
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to process image. Please try again.' },
      { status: 500 }
    );
  }
}
