import prisma from '@repo/db/clients';

interface CheckUserProps {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export default async function checkUser(props: CheckUserProps) {
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                email: props.email,
            },
        });

        if (existingUser) {
            return { message: "User already exists", success: false };
        }

        // Create a new user
        const user = await prisma.user.create({
            data: {
                firstName: props.firstName,
                lastName: props.lastName,
                email: props.email,
                password: props.password, // Make sure password is hashed before saving
            },
            select: {
                userId: true,
            },
        });

        return { message: "User successfully created", success: true, userId: user.userId };
    } catch (error) {
        console.error("Error creating user:", error);
        return { message: "Error creating user", success: false };
    }
}
