import prisma from '@repo/db/clients';
import { NextRequest, NextResponse } from 'next/server';
import {  hash } from 'bcrypt';
import { sendEmail } from '../../../../services/emailServices';
import { updateUserCurrentData } from '../../../../utils/updateUserData';


export async function POST(req: NextRequest) {
    const body = await req.json();
    const { firstName, lastName, email, password } = body;

    try {
      
        const existingUser = await prisma.user.findFirst({
            where: {
                email,
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { msg: "User already exists, kindly login" },
                { status: 401 }
            );
        }

        
        const hashedPassword = await hash(password, 10);

        
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
            },
        });
        console.log("email sending");
        
        await sendEmail("WELCOME",email,{ name: "John Doe"})
        console.log("email sendt sucessfull");
        updateUserCurrentData(user.id,{emailResponse:true})
        
        return NextResponse.json(
            { user },
            { status: 201 } 
        );
    } catch (error) {
        console.error("Error during signup:", error); 
        return NextResponse.json(
            { msg: "There was an error while signing up" },
            { status: 500 } 
        );
    }
}
