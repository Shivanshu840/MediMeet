import Nextauth from "next-auth";
import { authOption } from "../../../lib/action";

const handler = Nextauth(authOption);

export { handler as GET, handler as POST };
