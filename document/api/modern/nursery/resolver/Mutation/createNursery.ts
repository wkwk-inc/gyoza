
import * as types from '../../../../type'
import * as config from '../../../../config'
import * as utils from '../../../../util'
import * as repositories from '../../../../repository'

export const createNursery: types.graphql.MutationResolvers['createNursery'] = async (parent, args, context, info) => {
  const nursery = await repositories.nursery.create({
    data: args.input,
  })
  const payload = {
    clientMutationId: args.input.clientMutationId,
    nursery,
  }
  return payload
}
