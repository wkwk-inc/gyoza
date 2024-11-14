
import * as types from '../../../../type'
import * as config from '../../../../config'
import * as utils from '../../../../util'
import * as repositories from '../../../../repository'

export const nurseries: types.graphql.BabyResolvers['nurseries'] = async (parent, args, context, info) => {
  const pagination = new utils.Pagination({
    first: args.first,
    after: args.after,
    last: args.last,
    before: args.before,
  })
  const nurseryBabies = await repositories.nurseryBaby.findMany({
    where: {
      babyId: {
        equals: parent.id,
      },
    },
    cursor: pagination.queryArgs.cursor,
    take: pagination.queryArgs.take,
    skip: pagination.queryArgs.skip,
  })
  const nurseries = await repositories.nursery.findUniqueMany({
    where: nurseryBabies.map((value) => ({
      id: value.nurseryId,
    }))
  })
  pagination.setNodeIds(nurseries.map((node) => node.id))
  const edges = nurseries.filter((node) => pagination.nodeIds.includes(node.id)).map((node) => ({
    cursor: node.id,
    node,
  }))
  const pageInfo = pagination.pageInfo
  const totalCount = nurseries.length
  const filteredCount = nurseries.length
  const connection = {
    edges,
    pageInfo,
    totalCount,
    filteredCount,
  }
  return connection
}
