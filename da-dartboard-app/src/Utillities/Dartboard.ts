export enum SegmentID {
    INNER_1, TRP_1, OUTER_1, DBL_1,
    INNER_2, TRP_2, OUTER_2, DBL_2,
    INNER_3, TRP_3, OUTER_3, DBL_3,
    INNER_4, TRP_4, OUTER_4, DBL_4,
    INNER_5, TRP_5, OUTER_5, DBL_5,
    INNER_6, TRP_6, OUTER_6, DBL_6,
    INNER_7, TRP_7, OUTER_7, DBL_7,
    INNER_8, TRP_8, OUTER_8, DBL_8,
    INNER_9, TRP_9, OUTER_9, DBL_9,
    INNER_10, TRP_10, OUTER_10, DBL_10,
    INNER_11, TRP_11, OUTER_11, DBL_11,
    INNER_12, TRP_12, OUTER_12, DBL_12,
    INNER_13, TRP_13, OUTER_13, DBL_13,
    INNER_14, TRP_14, OUTER_14, DBL_14,
    INNER_15, TRP_15, OUTER_15, DBL_15,
    INNER_16, TRP_16, OUTER_16, DBL_16,
    INNER_17, TRP_17, OUTER_17, DBL_17,
    INNER_18, TRP_18, OUTER_18, DBL_18,
    INNER_19, TRP_19, OUTER_19, DBL_19,
    INNER_20, TRP_20, OUTER_20, DBL_20,
    BULL, DBL_BULL,
    RESET_BUTTON,
}

export enum SegmentSection {
    One = 1,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Eleven,
    Twelve,
    Thirteen,
    Fourteen,
    Fifteen,
    Sixteen,
    Seventeen,
    Eighteen,
    Nineteen,
    Twenty,
    BULL = 25,
    RESET_BUTTON,
}

export enum SegmentType {
    Single = 1,
    Double = 2,
    Triple = 3,
    Other = 4,
}

const GRANBOARD_UUID = "442f1570-8a00-9a28-cbe1-e1d4212d53eb";

const SEGMENT_MAPPING = {
    "50-46-51-64":    SegmentID.INNER_1,  "50-46-52-64":    SegmentID.TRP_1,  "50-46-53-64":    SegmentID.OUTER_1,  "50-46-54-64":    SegmentID.DBL_1,
    "57-46-49-64":    SegmentID.INNER_2,  "57-46-48-64":    SegmentID.TRP_2,  "57-46-50-64":    SegmentID.OUTER_2,  "56-46-50-64":    SegmentID.DBL_2,
    "55-46-49-64":    SegmentID.INNER_3,  "55-46-48-64":    SegmentID.TRP_3,  "55-46-50-64":    SegmentID.OUTER_3,  "56-46-52-64":    SegmentID.DBL_3,
    "48-46-49-64":    SegmentID.INNER_4,  "48-46-51-64":    SegmentID.TRP_4,  "48-46-53-64":    SegmentID.OUTER_4,  "48-46-54-64":    SegmentID.DBL_4,
    "53-46-49-64":    SegmentID.INNER_5,  "53-46-50-64":    SegmentID.TRP_5,  "53-46-52-64":    SegmentID.OUTER_5,  "52-46-54-64":    SegmentID.DBL_5,
    "49-46-48-64":    SegmentID.INNER_6,  "49-46-49-64":    SegmentID.TRP_6,  "49-46-51-64":    SegmentID.OUTER_6,  "52-46-52-64":    SegmentID.DBL_6,
    "49-49-46-49-64": SegmentID.INNER_7,  "49-49-46-50-64": SegmentID.TRP_7,  "49-49-46-52-64": SegmentID.OUTER_7,  "56-46-54-64":    SegmentID.DBL_7,
    "54-46-50-64":    SegmentID.INNER_8,  "54-46-52-64":    SegmentID.TRP_8,  "54-46-53-64":    SegmentID.OUTER_8,  "54-46-54-64":    SegmentID.DBL_8,
    "57-46-51-64":    SegmentID.INNER_9,  "57-46-52-64":    SegmentID.TRP_9,  "57-46-53-64":    SegmentID.OUTER_9,  "57-46-54-64":    SegmentID.DBL_9,
    "50-46-48-64":    SegmentID.INNER_10, "50-46-49-64":    SegmentID.TRP_10, "50-46-50-64":    SegmentID.OUTER_10, "52-46-51-64":    SegmentID.DBL_10,
    "55-46-51-64":    SegmentID.INNER_11, "55-46-52-64":    SegmentID.TRP_11, "55-46-53-64":    SegmentID.OUTER_11, "55-46-54-64":    SegmentID.DBL_11,
    "53-46-48-64":    SegmentID.INNER_12, "53-46-51-64":    SegmentID.TRP_12, "53-46-53-64":    SegmentID.OUTER_12, "53-46-54-64":    SegmentID.DBL_12,
    "48-46-48-64":    SegmentID.INNER_13, "48-46-50-64":    SegmentID.TRP_13, "48-46-52-64":    SegmentID.OUTER_13, "52-46-53-64":    SegmentID.DBL_13,
    "49-48-46-51-64": SegmentID.INNER_14, "49-48-46-52-64": SegmentID.TRP_14, "49-48-46-53-64": SegmentID.OUTER_14, "49-48-46-54-64": SegmentID.DBL_14,
    "51-46-48-64":    SegmentID.INNER_15, "51-46-49-64":    SegmentID.TRP_15, "51-46-50-64":    SegmentID.OUTER_15, "52-46-50-64":    SegmentID.DBL_15,
    "49-49-46-48-64": SegmentID.INNER_16, "49-49-46-51-64": SegmentID.TRP_16, "49-49-46-53-64": SegmentID.OUTER_16, "49-49-46-54-64": SegmentID.DBL_16,
    "49-48-46-49-64": SegmentID.INNER_17, "49-48-46-48-64": SegmentID.TRP_17, "49-48-46-50-64": SegmentID.OUTER_17, "56-46-51-64":    SegmentID.DBL_17,
    "49-46-50-64":    SegmentID.INNER_18, "49-46-52-64":    SegmentID.TRP_18, "49-46-53-64":    SegmentID.OUTER_18, "49-46-54-64":    SegmentID.DBL_18,
    "54-46-49-64":    SegmentID.INNER_19, "54-46-48-64":    SegmentID.TRP_19, "54-46-51-64":    SegmentID.OUTER_19, "56-46-53-64":    SegmentID.DBL_19,
    "51-46-51-64":    SegmentID.INNER_20, "51-46-52-64":    SegmentID.TRP_20, "51-46-53-64":    SegmentID.OUTER_20, "51-46-54-64":    SegmentID.DBL_20,
    "56-46-48-64":    SegmentID.BULL,     "52-46-48-64":    SegmentID.DBL_BULL,
    "66-84-78-64":    SegmentID.RESET_BUTTON,
}

export class Segment {
    public readonly ID: SegmentID;
    public readonly Type: SegmentType;
    public readonly Section: SegmentSection;
    public readonly Value: number;
    public readonly LongName: String;
    public readonly ShortName: String;

    public constructor(segmentId: SegmentID) {
        this.ID = segmentId;

        // There are 80 regular segments, and then 3 special (bullseye, double bullseye, and reset button)
        if (segmentId < 80) {
            switch (segmentId % 4) {
                case 1:
                    this.Type = SegmentType.Triple;
                    break;
                case 3:
                    this.Type = SegmentType.Double;
                    break;
                default:
                    this.Type = SegmentType.Single;
            }
            this.Section = Math.ceil((segmentId + 1) / 4);
            this.Value = this.Section * this.Type
            this.LongName = Segment.segmentTypeToString(this.Type, false) + " " + this.Section;
            this.ShortName = Segment.segmentTypeToString(this.Type, true) + this.Section;
        } else {
            // The segment is either bullseye or the reset button
            switch (this.ID)
            {
                case SegmentID.BULL:
                case SegmentID.DBL_BULL:
                    this.Type = this.ID === SegmentID.BULL ? SegmentType.Single : SegmentType.Double;
                    this.Section = SegmentSection.BULL;
                    this.Value = this.ID === SegmentID.BULL ? 25 : 50;
                    this.LongName = Segment.segmentTypeToString(this.Type, false) + " Bullseye";
                    this.ShortName = Segment.segmentTypeToString(this.Type, true) + "BULL";
                    break;
                default:
                    this.Type = SegmentType.Other;
                    this.Section = SegmentSection.RESET_BUTTON;
                    this.Value = 0;
                    this.LongName = "Reset Button";
                    this.ShortName = "RST";
                    break;

            }
        }
    }

    private static segmentTypeToString(type: SegmentType, shorthand: boolean) {
        switch (type) {
            case SegmentType.Single:
                return "";
            case SegmentType.Double:
                return shorthand ? "D" : "Double";
            case SegmentType.Triple:
                return shorthand ? "T" : "Triple";
        }

        return "";
    }
}

export class Dartboard {
    private readonly bluetoothConnection : BluetoothRemoteGATTCharacteristic;

    private readonly segmentHitCallback : (segment: Segment) => void;

    public static async ConnectToBoard(callback: (segment: Segment) => void) : Promise<Dartboard> {
        const boardBluetooth = await navigator.bluetooth.requestDevice({filters:[{services: [GRANBOARD_UUID]}]});

        if (!boardBluetooth || !boardBluetooth.gatt) {
            throw new Error("Could not find matching service on bluetooth dartboard");
        }

        if (!boardBluetooth.gatt.connected) {
            await boardBluetooth.gatt.connect();
        }

        const service = await boardBluetooth.gatt.getPrimaryService(GRANBOARD_UUID);

        // Find the characteristic that supports the notify property. That is the one that executes when
        // a dartboard segment is hit
        let boardCharacteristic = (await service.getCharacteristics()).find(characteristic => characteristic.properties.notify);

        if (!boardCharacteristic) {
            throw new Error("Could not find matching bluetooth charactaristic on dartboard");
        }

        const board = new Dartboard(boardCharacteristic, callback);

        await boardCharacteristic.startNotifications();

        return board;
    }

    private constructor(bluetoothConnection: BluetoothRemoteGATTCharacteristic, callback: (segment: Segment) => void)
    {
        this.bluetoothConnection = bluetoothConnection;
        this.segmentHitCallback = callback;

        this.bluetoothConnection.addEventListener("characteristicvaluechanged", this.onSegmentHit.bind(this));
    }
    
    private onSegmentHit() {
        if (!this.bluetoothConnection.value) {
            return; // There is no new value
        }

        const segmentUID = new Uint8Array(this.bluetoothConnection.value.buffer).join("-");
        const segmentID = (SEGMENT_MAPPING as any)[segmentUID]; // There is probably a type safe way without resulting to "any"

        if (segmentID !== undefined) {
            console.log(segmentID)
            this.segmentHitCallback(new Segment(segmentID));
        } else {
            console.log(`Unknown segment: ${segmentID}`);
        }
    }
}