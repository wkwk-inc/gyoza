
import * as types from '../../../../type'
import * as config from '../../../../config'
import * as utils from '../../../../util'
import * as repositories from '../../../../repository'

export const summaryHealthes: types.graphql.BabyResolvers['summaryHealthes'] = async (parent, args, context, info) => {
  const pagination = new utils.Pagination({
    first: args.first,
    after: args.after,
    last: args.last,
    before: args.before,
  })
  const summaryHealthes = await repositories.summaryHealth.findMany({
    where: {
      babyId: {
        equals: parent.id,
      },
      ...args.filterBy,
    },
    orderBy: args.orderBy,
    cursor: pagination.queryArgs.cursor,
    take: pagination.queryArgs.take,
    skip: pagination.queryArgs.skip,
  })
  pagination.setNodeIds(summaryHealthes.map((node) => node.id))
  const edges = summaryHealthes.filter((node) => pagination.nodeIds.includes(node.id)).map((node) => ({
    cursor: node.id,
    node,
  }))
  const pageInfo = pagination.pageInfo
  const totalCount = await repositories.summaryHealth.count({
    where: {
      babyId: {
        equals: parent.id,
      },
    },
  })
  const filteredCount = await repositories.summaryHealth.count({
    where: {
      babyId: {
        equals: parent.id,
      },
      ...args.filterBy,
    },
  })
  const connection = {
    edges,
    pageInfo,
    totalCount,
    filteredCount,
  }
  return connection
}
