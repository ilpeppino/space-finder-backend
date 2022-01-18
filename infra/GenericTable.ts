import { AttributeType, Table }         from 'aws-cdk-lib/aws-dynamodb'
import { Stack }                        from 'aws-cdk-lib'
import { NodejsFunction}                from 'aws-cdk-lib/aws-lambda-nodejs'
import { LambdaIntegration }            from 'aws-cdk-lib/aws-apigateway'
import { join }                         from 'path'



export interface TableProps {
    tableName           : string
    primaryKey          : string
    createLambdaPath?   : string  //optional
    readLambdaPath?     : string  //optional
    updateLambdaPath?   : string  //optional
    deleteLambdaPath?   : string  //optional
    secondaryIndexes?   : string[] //optional
}

export class GenericTable {

    // Local variables

    private _stack: Stack
    private _table: Table
    private _props: TableProps

    private _createLambda    : NodejsFunction | undefined
    private _readLambda      : NodejsFunction | undefined
    private _updateLambda    : NodejsFunction | undefined
    private _deleteLambda    : NodejsFunction | undefined

    // Public variables
    public createLambdaIntegration  : LambdaIntegration
    public readLambdaIntegration    : LambdaIntegration
    public updateLambdaIntegration  : LambdaIntegration
    public deleteLambdaIntegration  : LambdaIntegration

    // Constructor for table creation
    public constructor (stack: Stack, props: TableProps) {
        
        this._stack = stack
        this._props = props
        this.initialize()
      
    }

    private initialize() {
        this.createTable()
        this.addSecondaryIndexes()
        this.createLambdas()
        this.grantTableRights()
    }

    private createTable() {
        this._table = new Table(this._stack, this._props.tableName, {
            partitionKey: {
                name: this._props.primaryKey,
                type: AttributeType.STRING
            },
            tableName: this._props.tableName
        })
    }

    private createLambdas() {
        // Checks if tableProps has one of the *LambdaPath element
        if (this._props.createLambdaPath) {
            this._createLambda = this.createSingleLambda(this._props.createLambdaPath)
            this.createLambdaIntegration = new LambdaIntegration(this._createLambda)
        }
        if (this._props.readLambdaPath) {
            this._readLambda = this.createSingleLambda(this._props.readLambdaPath)
            this.readLambdaIntegration = new LambdaIntegration(this._readLambda)
        }
        if (this._props.updateLambdaPath) {
            this._updateLambda = this.createSingleLambda(this._props.updateLambdaPath)
            this.updateLambdaIntegration = new LambdaIntegration(this._updateLambda)
        }
        if (this._props.deleteLambdaPath) {
            this._deleteLambda = this.createSingleLambda(this._props.deleteLambdaPath)
            this.deleteLambdaIntegration = new LambdaIntegration(this._deleteLambda)
        }
    }


    private grantTableRights() {
        if (this._createLambda) {
            this._table.grantWriteData(this._createLambda)
        }
        if (this._readLambda) {
            this._table.grantWriteData(this._readLambda)
        }
        if (this._updateLambda) {
            this._table.grantWriteData(this._updateLambda)
        }
        if (this._deleteLambda) {
            this._table.grantWriteData(this._deleteLambda)
        }
    }

    private addSecondaryIndexes() {
        if (this._props.secondaryIndexes) {
            for (const secondaryIndex of this._props.secondaryIndexes) {
                this._table.addGlobalSecondaryIndex({
                    indexName: secondaryIndex,
                    partitionKey: {
                        name: secondaryIndex,
                        type: AttributeType.STRING
                    }
                })
            }         
        }
    }

    // Defines the entrypoint for the lambdas based on lambdaName. Each lambda will then perform specific operations
    private createSingleLambda(lambdaName: string): NodejsFunction {

        const lambaId = `${this._props.tableName}-${lambdaName}`
        
        // Creates lambda with name lambdaId in the stack, which executes the .ts script
        return new NodejsFunction(this._stack, lambaId, {
            entry: (join(__dirname,'..','services',this._props.tableName, `${lambdaName}.ts`)),
            handler: "handler",
            functionName: lambaId, // this allows to customize the lambda name in console
            environment: {
                TABLE_NAME: this._props.tableName,
                PRIMARY_KEY: this._props.primaryKey
            }
        })
    }

}