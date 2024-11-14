
import * as types from '../../../../type'
import * as config from '../../../../config'
import * as utils from '../../../../util'
import * as repositories from '../../../../repository'

export const sitters: types.graphql.QueryResolvers['sitters'] = async (parent, args, context, info) => {
  const pagination = new utils.Pagination({
    first: args.first,
    after: args.after,
    last: args.last,
    before: args.before,
  })
  const sitters = await repositories.sitter.findMany({
    where: {
      ...args.filterBy,
    },
    query: args.query,
    orderBy: args.orderBy,
    cursor: pagination.queryArgs.cursor,
    take: pagination.queryArgs.take,
    skip: pagination.queryArgs.skip,
  })
  pagination.setNodeIds(sitters.map((node) => node.id))
  const edges = sitters.filter((node) => pagination.nodeIds.includes(node.id)).map((node) => ({
    cursor: node.id,
    node,
  }))
  const pageInfo = pagination.pageInfo
  const totalCount = await repositories.sitter.count()
  const filteredCount = await repositories.sitter.count({
    where: {
      ...args.filterBy,
    },
    query: args.query,
  })
  const connection = {
    edges,
    pageInfo,
    totalCount,
    filteredCount,
  }
  return connection
}
