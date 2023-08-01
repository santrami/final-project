import { verifyJwt } from "@/lib/jwt";
import prismadb from "@/lib/prismadb";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const accessToken = request.headers.get("authorization");

  if (!accessToken || !verifyJwt(accessToken)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const userMessages = await prismadb.message.findMany({
    where: { authorId: Number(params.id) },
    include: {
      author: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });
  return new Response(JSON.stringify(userMessages), { status: 200 });
}
