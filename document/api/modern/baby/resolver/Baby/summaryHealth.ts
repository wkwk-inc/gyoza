
import * as types from '../../../../type'
import * as repositories from '../../../../repository'

export const summaryHealth: types.graphql.BabyResolvers['summaryHealth'] = async (parent, args, context, info) => {
  const decodedId = repositories.summaryHealth.decodeId(args.id)
  if (!decodedId) {
    return null
  }
  const summaryHealth = await repositories.summaryHealth.findUnique({
    where: {
      babyId: parent.id,
      date: decodedId.date,
    }
  })
  return summaryHealth
}
