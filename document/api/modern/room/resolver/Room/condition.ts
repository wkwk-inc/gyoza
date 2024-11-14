
import * as types from '../../../../type'
import * as repositories from '../../../../repository'

export const condition: types.graphql.RoomResolvers['condition'] = async (parent, args, context, info) => {
  const decodedId = repositories.roomCondition.decodeId(args.id)
  const roomCondition = await repositories.roomCondition.findUnique({
    where: {
      roomId: parent.id,
      date: decodedId.date,
    }
  })
  return roomCondition
}
