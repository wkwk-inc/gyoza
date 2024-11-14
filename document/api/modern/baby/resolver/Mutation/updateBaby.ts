
import * as types from '../../../../type'
import * as repositories from '../../../../repository'

export const updateBaby: types.graphql.MutationResolvers['updateBaby'] = async (parent, args, context, info) => {
  const baby = await repositories.baby.update({
    data: args.input,
    where: {
      id: args.input.id,
    }
  })
  const payload = {
    clientMutationId: args.input.clientMutationId,
    baby,
  }
  return payload
}
