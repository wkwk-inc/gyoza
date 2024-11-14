
import * as types from '../../../../type'
import * as repositories from '../../../../repository'

export const sitter: types.graphql.NurseryResolvers['sitter'] = async (parent, args, context, info) => {
  const nurserySitter = await repositories.nurserySitter.findUnique({
    where: {
      nurseryId: parent.id,
      sitterId: args.id,
    },
  })
  if (!nurserySitter) {
    return null
  }
  const sitter = await repositories.sitter.findUnique({
    where: {
      id: args.id,
    }
  })
  return sitter
}
