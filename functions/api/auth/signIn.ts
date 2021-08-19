import type { ApiEndpoint } from 'vitedge'
import { Client, query as q } from 'faunadb'
export default <ApiEndpoint>{
  async handler() {
    const secret = import.meta.env.VITEDGE_FAUNA_SERVER_KEY as string
    if (!secret)
      throw new Error('⚠ define VITEDGE_FAUNA_SERVER_KEY in .env.production!')

    const client = new Client({ secret, keepAlive: false })
    const user = await client.query(
      q.Login(q.Match(q.Index('users_by_email'), 'example@contoso.com'), {
        password: 'pass4word',
      })
    )
    return {
      data: {
        hello: 'world',
        env: import.meta.env.VITEDGE_TEST,
        user,
      },
    }
  },
}
