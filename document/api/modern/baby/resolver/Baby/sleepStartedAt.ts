
import * as types from '../../../../type'
import * as repositories from '../../../../repository'

export const sleepStartedAt: types.graphql.BabyResolvers['sleepStartedAt'] = async (parent, args, context, info) => {
  const sleeps = await repositories.sleep.findMany({
    where: {
      babyId: {
        equals: parent.id,
      },
    },
    orderBy: {
      direction: types.graphql.OrderDirection.Desc,
      field: types.graphql.SleepOrderField.CreatedAt,
    },
    take: 1,
  })
  const sleep = sleeps.at(0)
  if (!sleep) {
    return null
  }
  if (sleep.startEnd !== types.graphql.StartEnd.Start) {
    return null
  }
  return sleep.createdAt
}
