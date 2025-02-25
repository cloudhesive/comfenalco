import { Construct } from "constructs";
import { GuardarDescargaDatosBlock } from "../shared/guardar-descargar-datos-block";
import { CfnOutput } from "aws-cdk-lib";
import config from "../config/single-connect";

type Props = {};

export class SaveOnlyFlow extends Construct {
  constructor(scope: Construct, id: string, props?: Props) {
    super(scope, id);

    const guardaDescargaDatosBlock = new GuardarDescargaDatosBlock(
      this,
      `${id}GuardarDescargaDatosBlock`,
      { pkName: config.pkName },
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
  }
}
