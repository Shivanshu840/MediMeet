import { getServerSession } from "next-auth"
import { authOption } from "../lib/action";


export default async function FUCK(){
    const session = await getServerSession(authOption);
    return <div>
        {JSON.stringify(session)}
    </div>
}