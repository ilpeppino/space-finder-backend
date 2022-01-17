import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'


// This is the function that will count the hits
export interface HitCounterProps {
    downstream: lambda.IFunction
}


// Custom constructs extend Construct class
export class HitCounter extends Construct{
    constructor(scope: Construct, id: string, props: HitCounterProps) {
        super(scope,id)
    }    
}