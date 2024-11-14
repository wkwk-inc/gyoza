
import * as types from '../../../../type'
import * as config from '../../../../config'
import * as utils from '../../../../util'
import * as repositories from '../../../../repository'

export const sitters: types.graphql.NurseryResolvers['sitters'] = async (parent, args, context, info) => {
  const pagination = new utils.Pagination({
    first: args.first,
    after: args.after,
    last: args.last,
    before: args.before,
  })
  const nurserySitters = await repositories.nurserySitter.findMany({
    where: {
      nurseryId: {
        equals: parent.id,
      },
      deletedAt: {
        equals: args.includeDeleted ? undefined : null,
      },
      isAdmin: {
        equals: args.isAdmin,
      },
    },
    cursor: pagination.queryArgs.cursor,
    take: pagination.queryArgs.take,
    skip: pagination.queryArgs.skip,
  })
  const sitters = await repositories.sitter.findUniqueMany({
    where: nurserySitters.map((value) => ({
      id: value.sitterId,
    }))
  })
  for (const sitter of sitters) {
    const nurserySitter = nurserySitters.find((value) => value.sitterId === sitter.id)
    sitter.deletedAt = nurserySitter?.deletedAt
  }
  pagination.setNodeIds(sitters.map((node) => node.id))
  const edges = sitters.filter((node) => pagination.nodeIds.includes(node.id)).map((node) => {
    const nurserySitter = nurserySitters.find((value) => (value.sitterId === node.id))
    return {
      cursor: node.id,
      node,
      deletedAt: nurserySitter?.deletedAt,
      isAdmin: nurserySitter?.isAdmin,
    }
  })
  const pageInfo = pagination.pageInfo
  const totalCount = await repositories.nurserySitter.count({
    where: {
      nurseryId: {
        equals: parent.id,
      },
      isAdmin: {
        equals: args.isAdmin,
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
