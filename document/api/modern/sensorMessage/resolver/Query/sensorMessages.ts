
import * as types from '../../../../type'
import * as config from '../../../../config'
import * as utils from '../../../../util'
import * as repositories from '../../../../repository'

export const sensorMessages: types.graphql.QueryResolvers['sensorMessages'] = async (parent, args, context, info) => {
  const pagination = new utils.Pagination({
    first: args.first,
    after: args.after,
    last: args.last,
    before: args.before,
  })
  const edges: types.graphql.SensorMessageEdge[] = []
  const pageInfo = pagination.pageInfo
  const totalCount = 0
  const filteredCount = 0
  const connection = {
    edges,
    pageInfo,
    totalCount,
    filteredCount,
  }
  return connection
}
