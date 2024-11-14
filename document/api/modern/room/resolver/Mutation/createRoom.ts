
import * as types from '../../../../type'
import * as config from '../../../../config'
import * as utils from '../../../../util'
import * as repositories from '../../../../repository'

export const createRoom: types.graphql.MutationResolvers['createRoom'] = async (parent, args, context, info) => {
  const payload = {
    clientMutationId: args.input.clientMutationId,
  }
  return payload
}
