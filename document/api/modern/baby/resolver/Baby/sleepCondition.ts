
import * as types from '../../../../type'
import * as repositories from '../../../../repository'

export const sleepCondition: types.graphql.BabyResolvers['sleepCondition'] = async (parent, args, context, info) => {
  const decodedId = repositories.sleepCondition.decodeId(args.id)
  if (!decodedId) {
    return null
  }
  const sleepCondition = await repositories.sleepCondition.findUnique({
    where: {
      babyId: parent.id,
      checkedAt: decodedId.checkedAt,
      createdAt: decodedId.createdAt,
    }
  })
  return sleepCondition
}
