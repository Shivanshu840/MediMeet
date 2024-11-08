import { getServerSession } from "next-auth"


export default async function FUCK(){
    const session = await getServerSession();
    return <div>
        {JSON.stringify(session)}
    </div>
}