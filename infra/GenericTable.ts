import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb'
import { Stack } from 'aws-cdk-lib'

export class GenericTable {

    private tableName: string
    private primaryKey: string
    private stack: Stack
    private table: Table

    public constructor (tableName: string, primaryKey: string, stack: Stack) {
        
        this.tableName = tableName
        this.primaryKey = primaryKey
        this.stack = stack

        this.initialize()
        
    }

    private initialize() {
        this.createTable()
    }
    private createTable() {
        this.table = new Table(this.stack, this.tableName, {
            partitionKey: {
                name: this.primaryKey,
                type: AttributeType.STRING
            },
            tableName: this.tableName
        })
    }

}