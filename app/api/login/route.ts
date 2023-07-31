import prisma from "@/lib/prismadb";

interface RequestBody{
    username:string;
    password:string;
}

export async function Post(request:Request){
    const body: RequestBody = await request.json();

    const user = await prisma.user.findUnique({
        where: {
            email: body.username
        }
    })

    if(user && user.password === body.password){
        return {
            status: 200,
            body: {
                message: "Login successful"
            }
        }
    }
}