import { Construct } from "constructs";
import { AttributeType, TableV2 } from "aws-cdk-lib/aws-dynamodb";

type Props = { pkName: string };

export class DynamoDbBlock extends Construct {
  public pkName: string;
  public tableName: string;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    this.pkName = props.pkName;
    const resultsDB = new TableV2(this, `${id}-resultados-encuesta-dynamodb`, {
      partitionKey: { name: this.pkName, type: AttributeType.STRING },
      tableName: `${id}-resultados-encuesta`,
    });
    this.tableName = resultsDB.tableName;
  }
}
