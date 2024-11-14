
import * as types from '../../../../type'
import * as repositories from '../../../../repository'

export const createBaby: types.graphql.MutationResolvers['createBaby'] = async (parent, args, context, info) => {
  const baby = await repositories.baby.create({
    data: args.input,
  })
  const nurseryBaby = await repositories.nurseryBaby.create({
    data: {
      nurseryId: args.input.nurseryId,
      babyId: baby.id,
      deviceName: '',
    },
  })
  const payload = {
    clientMutationId: args.input.clientMutationId,
    baby,
  }
  return payload
}
