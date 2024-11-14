
import * as types from '../../../../type'
import * as repositories from '../../../../repository'

export const currentHealth: types.graphql.BabyResolvers['currentHealth'] = async (parent, args, context, info) => {
  const currentHealth = await repositories.currentHealth.findUnique({
    where: {
      id: parent.id,
    }
  })
  return currentHealth
}
