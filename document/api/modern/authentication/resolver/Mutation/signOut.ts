
import * as awsSdkClientCognitoIdentityProvider from '@aws-sdk/client-cognito-identity-provider'

import * as types from '../../../../type'
import * as config from '../../../../config'
import * as utils from '../../../../util'

export const signOut: types.graphql.MutationResolvers['signOut'] = async (parent, args, context, info) => {
  if (!args.input.refreshToken && !args.input.accessToken) {
    throw new Error('Either "refreshToken" or "accessToken" must be inputted')
  }
  if (args.input.refreshToken) {
    const revokeTokenCommand = new awsSdkClientCognitoIdentityProvider.RevokeTokenCommand({
      Token: args.input.refreshToken,
      ClientId: config.aws.cognito.appClientId,
      ClientSecret: config.aws.cognito.appClientSecret,
    })
    try {
      const revokeTokenCommandOutput = await utils.aws.cognito.clients.identityProvider.send(revokeTokenCommand)
    } catch (error) {
      console.error(error)
    }
  }
  if (args.input.accessToken) {
    const globalSignOutCommand = new awsSdkClientCognitoIdentityProvider.GlobalSignOutCommand({
      AccessToken: args.input.accessToken,
    })
    try {
      const globalSignOutCommandOutput = await utils.aws.cognito.clients.identityProvider.send(globalSignOutCommand)
    } catch (error) {
      console.error(error)
    }
  }
  const payload = {
    clientMutationId: args.input.clientMutationId,
  }
  return payload
}
