
import * as types from '../../../../type'
import * as config from '../../../../config'
import * as utils from '../../../../util'
import * as repositories from '../../../../repository'

export const nurseries: types.graphql.QueryResolvers['nurseries'] = async (parent, args, context, info) => {
  let availableNurseryIds: string[] | undefined
  const isCollaborator = context.user?.groups.some((value) => value === types.UserGroup.Partners)
  if (isCollaborator) {
    const availableNurseries = await repositories.syncAvailableNursery.findMany({
      where: {
        partnerId: {
          equals: context.user?.id,
        },
      },
    })
    availableNurseryIds = availableNurseries.map((value) => value.nurseryId)
  }
  const pagination = new utils.Pagination({
    first: args.first,
    after: args.after,
    last: args.last,
    before: args.before,
  })
  const nurseries = await repositories.nursery.findMany({
    where: {
      ...args.filterBy,
      id: {
        in: availableNurseryIds,
      },
    },
    query: args.query,
    orderBy: args.orderBy,
    cursor: pagination.queryArgs.cursor,
    take: pagination.queryArgs.take,
    skip: pagination.queryArgs.skip,
  })
  pagination.setNodeIds(nurseries.map((node) => node.id))
  const edges = nurseries.filter((node) => pagination.nodeIds.includes(node.id)).map((node) => ({
    cursor: node.id,
    node,
  }))
  const pageInfo = pagination.pageInfo
  const totalCount = await repositories.nursery.count({
    where: {
      id: {
        in: availableNurseryIds,
      },
    },
  })
  const filteredCount = await repositories.nursery.count({
    where: {
      ...args.filterBy,
      id: {
        in: availableNurseryIds,
      },
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
