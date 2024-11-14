
import * as types from '../../../../type'
import * as repositories from '../../../../repository'

export const baby: types.graphql.QueryResolvers['baby'] = async (parent, args, context, info) => {
  const baby = await repositories.baby.findUnique({
    where: {
      id: args.id,
    }
  })
  return baby
}
