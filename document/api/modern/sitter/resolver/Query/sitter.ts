
import * as types from '../../../../type'
import * as repositories from '../../../../repository'

export const sitter: types.graphql.QueryResolvers['sitter'] = async (parent, args, context, info) => {
  const sitter = await repositories.sitter.findUnique({
    where: {
      id: args.id,
    }
  })
  return sitter
}
