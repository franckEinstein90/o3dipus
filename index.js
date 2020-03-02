/*****************************************************************************
 *
 *
 * ***************************************************************************/
"use strict"
/*****************************************************************************/
require('module-alias/register')
/*****************************************************************************/



const app = {}

require('@clientServerCommon/features').addFeatureSystem( app )
require('@server/expressStack').addExpressStackFeature( app )
require('@server/routingSystem').addRouterFeature( app )
debugger

