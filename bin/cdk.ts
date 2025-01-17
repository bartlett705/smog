#!/usr/bin/env node
import * as cdk from '@aws-cdk/core'
import { Tag } from '@aws-cdk/core'
import 'source-map-support/register'
import SmogStack from '../lib'
// Importing this module has the side effect of building the lambda source using webpack and ts-loader
import './build-lambda'

const app = new cdk.App()
const stack = new SmogStack(app, 'SmogStack')

Tag.add(app, 'AppType', 'smogstack')
Tag.add(app, 'Provisioner', 'cdk')
