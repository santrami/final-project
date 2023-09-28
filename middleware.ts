export {default} from "next-auth/middleware"

export const config = {
    matcher: ["/tictactoe/sGame:path*", "/game:path*", "/tictactoe/mGame:path*"]
}