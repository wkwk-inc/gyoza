
import * as types from '../../../../type'
import * as repositories from '../../../../repository'

export const nursery: types.graphql.SitterResolvers['nursery'] = async (parent, args, context, info) => {
  const nurserySitters = await repositories.nurserySitter.findMany({
    where: {
      sitterId: {
        equals: parent.id,
      },
    },
  })
  if (nurserySitters.length === 0) {
    return null
  }
  const nursery = await repositories.nursery.findUnique({
    where: {
      id: nurserySitters[0].nurseryId,
    }
  })
  return nursery
}
