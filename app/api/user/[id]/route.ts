import prismadb from "@/lib/prismadb";

export async function GET (request: Request, {params}:{params:{id:number}}){
    const userMessages = await prismadb.message.findMany({
        where: {authorId: params.id},
        include: {
            author: {
                select: {
                    email: true,
                    name: true,
                }
            }
        }
    });
    return new Response(JSON.stringify(userMessages), {status: 200});
}