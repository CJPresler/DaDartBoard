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