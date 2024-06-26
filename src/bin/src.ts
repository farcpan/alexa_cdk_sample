import * as cdk from "aws-cdk-lib";
import { MainStack } from "../lib/main-stack";

const app = new cdk.App();
new MainStack(app, "alexa-cdk-sample-stack", {
  env: {
    region: "ap-northeast-1",
  },
});
