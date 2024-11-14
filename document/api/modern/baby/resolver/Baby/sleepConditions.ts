
import * as types from '../../../../type'
import * as config from '../../../../config'
import * as utils from '../../../../util'
import * as repositories from '../../../../repository'

export const sleepConditions: types.graphql.BabyResolvers['sleepConditions'] = async (parent, args, context, info) => {
  const pagination = new utils.Pagination({
    first: args.first,
    after: args.after,
    last: args.last,
    before: args.before,
  })
  const sleepConditions = await repositories.sleepCondition.findMany({
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
  pagination.setNodeIds(sleepConditions.map((node) => node.id))
  const edges = sleepConditions.filter((node) => pagination.nodeIds.includes(node.id)).map((node) => ({
    cursor: node.id,
    node,
  }))
  const pageInfo = pagination.pageInfo
  const totalCount = await repositories.sleepCondition.count({
    where: {
      babyId: {
        equals: parent.id,
      },
    },
  })
  const filteredCount = await repositories.sleepCondition.count({
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
