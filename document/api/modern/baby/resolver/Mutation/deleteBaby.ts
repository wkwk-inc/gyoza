
import * as types from '../../../../type'
import * as repositories from '../../../../repository'

export const deleteBaby: types.graphql.MutationResolvers['deleteBaby'] = async (parent, args, context, info) => {
  const baby = await repositories.baby.delete({
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
