
import * as types from '../../../../type'
import * as config from '../../../../config'
import * as utils from '../../../../util'
import * as repositories from '../../../../repository'

export const rooms: types.graphql.NurseryResolvers['rooms'] = async (parent, args, context, info) => {
  const pagination = new utils.Pagination({
    first: args.first,
    after: args.after,
    last: args.last,
    before: args.before,
  })
  const rooms = await repositories.room.findMany({
    where: {
      roomNurseryId: {
        equals: parent.id,
      },
      deletedAt: {
        equals: args.includeDeleted ? undefined : null,
      },
      ...args.filterBy,
    },
    orderBy: args.orderBy,
    cursor: pagination.queryArgs.cursor,
    take: pagination.queryArgs.take,
    skip: pagination.queryArgs.skip,
  })
  pagination.setNodeIds(rooms.map((node) => node.id))
  const edges = rooms.filter((node) => pagination.nodeIds.includes(node.id)).map((node) => ({
    cursor: node.id,
    node,
  }))
  const pageInfo = pagination.pageInfo
  const totalCount = await repositories.room.count({
    where: {
      roomNurseryId: {
        equals: parent.id,
      },
    },
  })
  const filteredCount = await repositories.room.count({
    where: {
      roomNurseryId: {
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
