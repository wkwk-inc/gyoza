
import * as types from '../../../../type'
import * as repositories from '../../../../repository'

export const sleep: types.graphql.BabyResolvers['sleep'] = async (parent, args, context, info) => {
  const decodedId = repositories.sleep.decodeId(args.id)
  const sleep = await repositories.sleep.findUnique({
    where: {
      babyId: parent.id,
      createdAt: decodedId.createdAt,
    }
  })
  return sleep
}
