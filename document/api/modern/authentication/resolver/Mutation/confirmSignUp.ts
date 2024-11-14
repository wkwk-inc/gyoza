
import * as awsSdkClientCognitoIdentityProvider from '@aws-sdk/client-cognito-identity-provider'

import * as types from '../../../../type'
import * as config from '../../../../config'
import * as utils from '../../../../util'

export const confirmSignUp: types.graphql.MutationResolvers['confirmSignUp'] = async (parent, args, context, info) => {
  const confirmSignUpCommand = new awsSdkClientCognitoIdentityProvider.ConfirmSignUpCommand({
    ClientId: config.aws.cognito.appClientId,
    SecretHash: utils.aws.cognito.calculateSecretHash(config.aws.cognito.appClientId, config.aws.cognito.appClientSecret, args.input.username),
    Username: args.input.username,
    ConfirmationCode: args.input.confirmationCode,
  })
  const confirmSignUpCommandOutput = await utils.aws.cognito.clients.identityProvider.send(confirmSignUpCommand)
  const payload = {
    clientMutationId: args.input.clientMutationId,
    userConfirmed: true,
  }
  return payload
}
