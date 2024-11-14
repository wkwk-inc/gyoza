
import * as types from '../../../../type'
import * as repositories from '../../../../repository'

export const nursery: types.graphql.BabyResolvers['nursery'] = async (parent, args, context, info) => {
  const nurseryBabies = await repositories.nurseryBaby.findMany({
    where: {
      babyId: {
        equals: parent.id,
      },
    },
  })
  if (nurseryBabies.length === 0) {
    return null
  }
  const nursery = await repositories.nursery.findUnique({
    where: {
      id: nurseryBabies[0].nurseryId,
    }
  })
  return nursery
}
