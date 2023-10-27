import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDb } from '@/lib/mongoose';
import User from '@/lib/models/user.model';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

async function handlerUser(req: any, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await connectToDb();
      const { name, email, image, _id } = await req.json();

      const userId = uuidv4();

      const newUser = new User({
        id: _id,
        name,
        email,
        image,
      });

      await newUser.save();

      return NextResponse.json({
        message: 'El usuario fue creado con éxito.',
        data: newUser,
      });
    } catch (error: any) {
      console.log('Error creating user:', error);
      throw new Error('Server Error');
    }
  } else {
    return NextResponse.json({
      message: 'Otro metodo.',
    });
  }
}

// async function handlePostRequest(req: any, res: NextApiResponse) {}

export { handlerUser as POST, handlerUser as GET };
