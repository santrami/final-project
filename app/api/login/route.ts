import { signJwtAccessToken } from "@/lib/jwt";
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

    if(user && (await bcrypt.compare(body.password, user.password!)) ){
        const {password, ...userWithoutPass} = user;
        const accessToken = signJwtAccessToken(userWithoutPass);
        const result = {
            ...userWithoutPass,
            accessToken
        }
        return new Response(JSON.stringify(result));
    }
    else{
        return new Error("Invalid username or password");
    }
}