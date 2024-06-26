import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { SecretValue } from "aws-cdk-lib";

import { Skill } from "cdk-alexa-skill";

const ALEXA_DEVELOPER_SSM_PARAM_PREFIX = "/alexa-cdk-blog/";

interface MainStackProps extends StackProps {}

export class MainStack extends Stack {
  constructor(scope: Construct, id: string, props: MainStackProps) {
    super(scope, id, props);

    const alexaVendorId = StringParameter.valueForStringParameter(
      this,
      `${ALEXA_DEVELOPER_SSM_PARAM_PREFIX}alexa-developer-vendor-id`
    );
    const lwaClientId = StringParameter.valueForStringParameter(
      this,
      `${ALEXA_DEVELOPER_SSM_PARAM_PREFIX}lwa-client-id`
    );
    const lwaClientSecret = SecretValue.secretsManager(
      `${ALEXA_DEVELOPER_SSM_PARAM_PREFIX}lwa-client-secret`
    );
    const lwaRefreshToken = SecretValue.secretsManager(
      `${ALEXA_DEVELOPER_SSM_PARAM_PREFIX}lwa-refresh-token`
    );
    const nodejsLambdaFunctionPath = join(__dirname, "../lambdas/index.ts");
    const alexaBackendFunction = new NodejsFunction(
      this,
      "AlexaBackendLambda",
      {
        functionName: "AlexaBackendLambda",
        entry: nodejsLambdaFunctionPath,
        handler: "handler",
        runtime: Runtime.NODEJS_20_X,
        timeout: Duration.seconds(60),
        logRetention: RetentionDays.ONE_DAY,
        environment: {},
      }
    );

    const skill = new Skill(this, "Skill", {
      endpointLambdaFunction: alexaBackendFunction,
      skillPackagePath: "frontend",
      alexaVendorId: alexaVendorId,
      lwaClientId: lwaClientId,
      lwaClientSecret: lwaClientSecret,
      lwaRefreshToken: lwaRefreshToken,
    });
  }
}
