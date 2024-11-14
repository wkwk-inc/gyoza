
import * as types from '../../../../type'
import * as config from '../../../../config'
import * as utils from '../../../../util'
import * as repositories from '../../../../repository'

export const createSitter: types.graphql.MutationResolvers['createSitter'] = async (parent, args, context, info) => {
  const payload = {
    clientMutationId: args.input.clientMutationId,
  }
  return payload
}
