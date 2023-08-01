import prismadb from "@/lib/prismadb";
import * as bcrypt from "bcrypt";
import { NextResponse } from "next/server";

interface RequestBody{
    username:string;
    password:string;
}

export async function POST(request:Request){
    const body: RequestBody = await request.json();

    const user = await prismadb.user.findUnique({
        where: {
            email: body.username
        }
    })

    if(user && (await bcrypt.compare(body.password, user.password)) ){
        const {password, ...userWithoutPass} = user;
        return new Response(JSON.stringify(userWithoutPass));
    }
    else{
        return new NextResponse(JSON.stringify("Invalid username or password"), {status: 401});
    }
}