// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { MessageData } from "../Interfaces/Contracts/Generated/MessageData";
import { ISerializable } from "../Interfaces/Telemetry/ISerializable";
import { dataSanitizeMessage, dataSanitizeProperties, dataSanitizeMeasurements } from "./Common/DataSanitizer";
import { FieldType } from "../Enums";
import { SeverityLevel } from "../Interfaces/Contracts/Generated/SeverityLevel";
import { IDiagnosticLogger } from "@microsoft/applicationinsights-core-js";
import { strNotSpecified } from "../Constants";

export class Trace extends MessageData implements ISerializable {

    public static envelopeType = "Microsoft.ApplicationInsights.{0}.Message";
    public static dataType = "MessageData";

    public aiDataContract = {
        ver: FieldType.Required,
        message: FieldType.Required,
        severityLevel: FieldType.Default,
        properties: FieldType.Default
    };

    /**
     * Constructs a new instance of the TraceTelemetry object
     */
    constructor(logger: IDiagnosticLogger, message: string, severityLevel?: SeverityLevel, properties?: any, measurements?: { [key: string]: number }) {
        super();
        message = message || strNotSpecified;
        this.message = dataSanitizeMessage(logger, message);
        this.properties = dataSanitizeProperties(logger, properties);
        this.measurements = dataSanitizeMeasurements(logger, measurements);

        if (severityLevel) {
            this.severityLevel = severityLevel;
        }
    }
}
