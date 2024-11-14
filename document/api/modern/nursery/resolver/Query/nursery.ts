
import * as types from '../../../../type'
import * as repositories from '../../../../repository'

export const nursery: types.graphql.QueryResolvers['nursery'] = async (parent, args, context, info) => {
  const nursery = await repositories.nursery.findUnique({
    where: {
      id: args.id,
    }
  })
  return nursery
}
