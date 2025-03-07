import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";

type Props = {
  lambdaConnect?: {
    batchSize?: number;
    // NOTE: Value in seconds
    // Max value: 300
    maxBatchingWindow?: number;
  };
  connectContactFlowIdsPerService: {
    surveys: { [key: string]: string };
    campaigns: { [key: string]: string };
  };
  pkName: string;
  maxRetriesFailed: number;
};

export class SharedResourcesBlock extends Construct {
  public secretParameters: Secret;

  constructor(scope: Construct, id: string, props?: Props) {
    super(scope, id);

    const secretTemplate = {
      INSTANCE_ID: "",
      connectContactFlowIdsPerService: {
        surveys: {},
        campaigns: {},
      },
    };

    const secretParameters = new Secret(this, `${id}ConfigSecret`, {
      secretName: `${id}ConfigSecret`,
      generateSecretString: {
        secretStringTemplate: JSON.stringify(secretTemplate),
        generateStringKey: "nonce_signing_secret",
        passwordLength: 16,
      },
    });

    // secret_parameters.grant_read(iam_imported_role)

    this.secretParameters = secretParameters;
  }
}
