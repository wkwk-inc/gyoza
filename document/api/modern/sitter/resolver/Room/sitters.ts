
import * as types from '../../../../type'
import * as config from '../../../../config'
import * as utils from '../../../../util'
import * as repositories from '../../../../repository'

export const sitters: types.graphql.RoomResolvers['sitters'] = async (parent, args, context, info) => {
  const pagination = new utils.Pagination({
    first: args.first,
    after: args.after,
    last: args.last,
    before: args.before,
  })
  const roomSitters = await repositories.roomSitter.findMany({
    where: {
      roomId: {
        equals: parent.id,
      },
      deletedAt: {
        equals: args.includeDeleted ? undefined : null,
      },
    },
    cursor: pagination.queryArgs.cursor,
    take: pagination.queryArgs.take,
    skip: pagination.queryArgs.skip,
  })
  const sitters = await repositories.sitter.findUniqueMany({
    where: roomSitters.map((value) => ({
      id: value.sitterId,
    }))
  })
  for (const sitter of sitters) {
    const roomSitter = roomSitters.find((value) => value.sitterId === sitter.id)
    sitter.deletedAt = roomSitter?.deletedAt
  }
  pagination.setNodeIds(sitters.map((node) => node.id))
  const edges = sitters.filter((node) => pagination.nodeIds.includes(node.id)).map((node) => {
    const roomSitter = roomSitters.find((value) => value.sitterId === node.id)
    return {
      cursor: node.id,
      node,
      deletedAt: roomSitter?.deletedAt,
    }
  })
  const pageInfo = pagination.pageInfo
  const totalCount = await repositories.roomSitter.count({
    where: {
      roomId: {
        equals: parent.id,
      },
    },
  })
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
