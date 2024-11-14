
import * as types from '../../../../type'
import * as repositories from '../../../../repository'

export const health: types.graphql.BabyResolvers['health'] = async (parent, args, context, info) => {
  const decodedId = repositories.health.decodeId(args.id)
  if (!decodedId) {
    return null
  }
  const health = await repositories.health.findUnique({
    where: {
      babyId: parent.id,
      date: decodedId.date,
    }
  })
  return health
}
