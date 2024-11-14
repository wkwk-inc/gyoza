
import * as types from '../../../../type'
import * as repositories from '../../../../repository'

export const room: types.graphql.NurseryResolvers['room'] = async (parent, args, context, info) => {
  const rooms = await repositories.room.findMany({
    where: {
      roomNurseryId: {
        equals: parent.id,
      },
    },
  })
  const room = rooms.find((value) => value.id === args.id)
  if (!room) {
    return null
  }
  return room
}
