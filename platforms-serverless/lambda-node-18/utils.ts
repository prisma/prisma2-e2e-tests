import * as AWS from 'aws-sdk'
import { AWSError } from 'aws-sdk'
import { PromiseResult } from 'aws-sdk/lib/request'

const Lambda = new AWS.Lambda({
  region: process.env.AWS_DEFAULT_REGION,
})

export async function invokeLambdaSync(
  functionName: string,
  payload: any,
): Promise<PromiseResult<AWS.Lambda.Types.InvocationResponse, AWSError>> {
  const req: AWS.Lambda.InvocationRequest = {
    FunctionName: functionName,
    Payload: JSON.stringify(payload),
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
  }
  const result = await Lambda.invoke(req).promise()

  const logs = Buffer.from(result.LogResult as string, 'base64').toString()
  console.log('function logs:')
  console.log(logs)

  return result
}
