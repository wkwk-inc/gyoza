
import * as types from '../../../../type'
import * as config from '../../../../config'
import * as utils from '../../../../util'
import * as repositories from '../../../../repository'

export const babies: types.graphql.NurseryResolvers['babies'] = async (parent, args, context, info) => {
  const pagination = new utils.Pagination({
    first: args.first,
    after: args.after,
    last: args.last,
    before: args.before,
  })
  const nurseryBabies = await repositories.nurseryBaby.findMany({
    where: {
      nurseryId: {
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
  const babies = await repositories.baby.findUniqueMany({
    where: nurseryBabies.map((value) => ({
      id: value.babyId,
    }))
  })
  for (const baby of babies) {
    const nurseryBaby = nurseryBabies.find((value) => value.babyId === baby.id)
    baby.deletedAt = nurseryBaby?.deletedAt
  }
  pagination.setNodeIds(babies.map((node) => node.id))
  const edges = babies.filter((node) => pagination.nodeIds.includes(node.id)).map((node) => {
    const nurseryBaby = nurseryBabies.find((value) => value.babyId === node.id)
    return {
      cursor: node.id,
      node,
      deletedAt: nurseryBaby?.deletedAt,
      sensorDeviceId: nurseryBaby?.sensorDeviceId,
    }
  })
  const pageInfo = pagination.pageInfo
  const totalCount = await repositories.nurseryBaby.count({
    where: {
      nurseryId: {
        equals: parent.id,
      },
    },
  })
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
