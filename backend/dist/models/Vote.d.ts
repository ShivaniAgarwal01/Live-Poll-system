import mongoose from "mongoose";
export declare const Vote: mongoose.Model<{
    pollId?: mongoose.Types.ObjectId | null;
    studentId?: string | null;
    optionId?: string | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    pollId?: mongoose.Types.ObjectId | null;
    studentId?: string | null;
    optionId?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    pollId?: mongoose.Types.ObjectId | null;
    studentId?: string | null;
    optionId?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    pollId?: mongoose.Types.ObjectId | null;
    studentId?: string | null;
    optionId?: string | null;
}, mongoose.Document<unknown, {}, {
    pollId?: mongoose.Types.ObjectId | null;
    studentId?: string | null;
    optionId?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    pollId?: mongoose.Types.ObjectId | null;
    studentId?: string | null;
    optionId?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        pollId?: mongoose.Types.ObjectId | null;
        studentId?: string | null;
        optionId?: string | null;
    }, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<{
        pollId?: mongoose.Types.ObjectId | null;
        studentId?: string | null;
        optionId?: string | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    pollId?: mongoose.Types.ObjectId | null;
    studentId?: string | null;
    optionId?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    pollId?: mongoose.Types.ObjectId | null;
    studentId?: string | null;
    optionId?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Vote.d.ts.map