
import * as types from '../../../../type'
import * as config from '../../../../config'
import * as utils from '../../../../util'
import * as repositories from '../../../../repository'

export const babies: types.graphql.QueryResolvers['babies'] = async (parent, args, context, info) => {
  const pagination = new utils.Pagination({
    first: args.first,
    after: args.after,
    last: args.last,
    before: args.before,
  })
  const babies = await repositories.baby.findMany({
    where: {
      ...args.filterBy,
    },
    query: args.query,
    orderBy: args.orderBy,
    cursor: pagination.queryArgs.cursor,
    take: pagination.queryArgs.take,
    skip: pagination.queryArgs.skip,
  })
  pagination.setNodeIds(babies.map((node) => node.id))
  const edges = babies.filter((node) => pagination.nodeIds.includes(node.id)).map((node) => ({
    cursor: node.id,
    node,
  }))
  const pageInfo = pagination.pageInfo
  const totalCount = await repositories.baby.count()
  const filteredCount = await repositories.baby.count({
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
