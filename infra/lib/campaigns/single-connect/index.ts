import { Construct } from "constructs";
import { GuardarDescargaDatosBlock } from "../shared/guardar-descargar-datos-block";
import { DispararConnectBlock } from "../shared/disparar-connect-block";
import { CfnOutput } from "aws-cdk-lib";
import config from "../config/single-connect";

type Props = {};

export class SingleConnectFlow extends Construct {
  constructor(scope: Construct, id: string, props?: Props) {
    super(scope, id);

    const guardaDescargaDatosBlock = new GuardarDescargaDatosBlock(
      this,
      `${id}GuardarDescargaDatosBlock`,
      { pkName: config.pkName },
    );

    const dispararConnectBlock = new DispararConnectBlock(
      this,
      `${id}DispararConnectBlock`,
      {
        connectArnPerService: config.connectArnPerService,
        lambdaConnect: {
          // NOTE: Valid Range: Minimum value of 1. Maximum value of 10.
          // If maxBatchingWindow is configured, this value can go up to 10,000.
          batchSize: 10,
          // NOTE: Valid Range: Minimum value of 0. Maximum value of 300 (5 min in seconds).
          maxBatchingWindow: undefined,
        },
        encuestasResultsDB: {
          pkName: guardaDescargaDatosBlock.pkName,
          tableName: guardaDescargaDatosBlock.tableName,
        },
      },
    );

    new CfnOutput(this, `${id}GuardarDatosLambdaArn`, {
      value: guardaDescargaDatosBlock.guardarDatosLambdaArn,
    });
    new CfnOutput(this, `${id}DescargarCsvLambdaArn`, {
      value: guardaDescargaDatosBlock.descargarCsvLambdaArn,
    });
    new CfnOutput(this, `${id}ArchivosResultadosBucketName`, {
      value: guardaDescargaDatosBlock.archivosResultadosBucketName,
    });
    new CfnOutput(this, `${id}CargarListadoBucketName`, {
      value: dispararConnectBlock.cargarListadoBucketName,
    });
  }
}
