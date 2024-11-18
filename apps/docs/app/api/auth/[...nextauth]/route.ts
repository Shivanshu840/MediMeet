import Nextauth from 'next-auth'
import { authOptionDoctor } from '../../../lib/authoption';

const handler = Nextauth(authOptionDoctor);

export { handler as GET, handler as POST }