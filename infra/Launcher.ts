import { SpaceStack } from "./SpaceStack";

// App represent the entire CDK app, it is defined here as entry point
import { App } from 'aws-cdk-lib'

const app = new App()
const spaceStack = new SpaceStack(app, 'Space-finder', {
    stackName: 'SpaceFinder'
})

