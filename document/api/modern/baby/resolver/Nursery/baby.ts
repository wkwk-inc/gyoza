
import * as types from '../../../../type'
import * as repositories from '../../../../repository'

export const baby: types.graphql.NurseryResolvers['baby'] = async (parent, args, context, info) => {
  const nurseryBaby = await repositories.nurseryBaby.findUnique({
    where: {
      nurseryId: parent.id,
      babyId: args.id,
    },
  })
  if (!nurseryBaby) {
    return null
  }
  const baby = await repositories.baby.findUnique({
    where: {
      id: args.id,
    }
  })
  return baby
}
