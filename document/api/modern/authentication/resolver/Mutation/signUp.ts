
import * as awsSdkClientCognitoIdentityProvider from '@aws-sdk/client-cognito-identity-provider'

import * as types from '../../../../type'
import * as config from '../../../../config'
import * as utils from '../../../../util'

export const signUp: types.graphql.MutationResolvers['signUp'] = async (parent, args, context, info) => {
  const signUpCommand = new awsSdkClientCognitoIdentityProvider.SignUpCommand({
    ClientId: config.aws.cognito.appClientId,
    SecretHash: utils.aws.cognito.calculateSecretHash(config.aws.cognito.appClientId, config.aws.cognito.appClientSecret, args.input.username),
    Username: args.input.username,
    Password: args.input.password,
    UserAttributes: [
      {
        Name: 'email',
        Value: args.input.email,
      }
    ],
  })
  const signUpCommandOutput = await utils.aws.cognito.clients.identityProvider.send(signUpCommand)
  const payload = {
    clientMutationId: args.input.clientMutationId,
    userConfirmed: signUpCommandOutput.UserConfirmed,
    codeDeliveryDetails: {
      destination: signUpCommandOutput.CodeDeliveryDetails?.Destination,
      deliveryMedium: signUpCommandOutput.CodeDeliveryDetails?.DeliveryMedium as types.graphql.DeliveryMedium,
      attributeName: signUpCommandOutput.CodeDeliveryDetails?.AttributeName,
    },
    userSub: signUpCommandOutput.UserSub,
  }
  return payload
}
