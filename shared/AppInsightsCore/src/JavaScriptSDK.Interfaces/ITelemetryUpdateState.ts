// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TelemetryUpdateReason } from "../JavaScriptSDK.Enums/TelemetryUpdateReason";
import { IConfiguration } from "./IConfiguration";
import { IPlugin } from "./ITelemetryPlugin";

export interface ITelemetryUpdateState {
    reason: TelemetryUpdateReason;
    prvCfg?: IConfiguration,
    newCfg?: IConfiguration,
    added?: IPlugin[];
    removed?: IPlugin[]
}