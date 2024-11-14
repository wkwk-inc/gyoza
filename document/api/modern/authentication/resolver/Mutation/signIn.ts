
import * as awsSdkClientCognitoIdentityProvider from '@aws-sdk/client-cognito-identity-provider'

import * as types from '../../../../type'
import * as config from '../../../../config'
import * as utils from '../../../../util'

export const signIn: types.graphql.MutationResolvers['signIn'] = async (parent, args, context, info) => {
  const adminInitiateAuthCommand = new awsSdkClientCognitoIdentityProvider.AdminInitiateAuthCommand({
    UserPoolId: config.aws.cognito.userPoolId,
    ClientId: config.aws.cognito.appClientId,
    AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: args.input.username,
      PASSWORD: args.input.password,
      SECRET_HASH: utils.aws.cognito.calculateSecretHash(config.aws.cognito.appClientId, config.aws.cognito.appClientSecret, args.input.username),
    },
  })
  const adminInitiateAuthCommandOutput = await utils.aws.cognito.clients.identityProvider.send(adminInitiateAuthCommand)
  const payload = {
    clientMutationId: args.input.clientMutationId,
    authenticationResult: {
      accessToken: adminInitiateAuthCommandOutput.AuthenticationResult?.AccessToken,
      expiresIn: adminInitiateAuthCommandOutput.AuthenticationResult?.ExpiresIn,
      tokenType: adminInitiateAuthCommandOutput.AuthenticationResult?.TokenType,
      refreshToken: adminInitiateAuthCommandOutput.AuthenticationResult?.RefreshToken,
      idToken: adminInitiateAuthCommandOutput.AuthenticationResult?.IdToken,
      newDeviceMetadata: {
        deviceKey: adminInitiateAuthCommandOutput.AuthenticationResult?.NewDeviceMetadata?.DeviceKey,
        deviceGroupKey: adminInitiateAuthCommandOutput.AuthenticationResult?.NewDeviceMetadata?.DeviceGroupKey,
      },
    },
    session: adminInitiateAuthCommandOutput.Session,
    challengeName: adminInitiateAuthCommandOutput.ChallengeName as types.graphql.ChallengeName | undefined,
  }
  return payload
}
