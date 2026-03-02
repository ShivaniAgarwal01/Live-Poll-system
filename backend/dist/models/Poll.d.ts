import mongoose from "mongoose";
export declare const Poll: mongoose.Model<{
    question: string;
    options: mongoose.Types.DocumentArray<{
        votes: number;
        id?: string | null;
        text?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        votes: number;
        id?: string | null;
        text?: string | null;
    }, {}, {}> & {
        votes: number;
        id?: string | null;
        text?: string | null;
    }>;
    duration: number;
    isActive: boolean;
    endsAt: number;
    startTime?: number | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    question: string;
    options: mongoose.Types.DocumentArray<{
        votes: number;
        id?: string | null;
        text?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        votes: number;
        id?: string | null;
        text?: string | null;
    }, {}, {}> & {
        votes: number;
        id?: string | null;
        text?: string | null;
    }>;
    duration: number;
    isActive: boolean;
    endsAt: number;
    startTime?: number | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    question: string;
    options: mongoose.Types.DocumentArray<{
        votes: number;
        id?: string | null;
        text?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        votes: number;
        id?: string | null;
        text?: string | null;
    }, {}, {}> & {
        votes: number;
        id?: string | null;
        text?: string | null;
    }>;
    duration: number;
    isActive: boolean;
    endsAt: number;
    startTime?: number | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    question: string;
    options: mongoose.Types.DocumentArray<{
        votes: number;
        id?: string | null;
        text?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        votes: number;
        id?: string | null;
        text?: string | null;
    }, {}, {}> & {
        votes: number;
        id?: string | null;
        text?: string | null;
    }>;
    duration: number;
    isActive: boolean;
    endsAt: number;
    startTime?: number | null;
}, mongoose.Document<unknown, {}, {
    question: string;
    options: mongoose.Types.DocumentArray<{
        votes: number;
        id?: string | null;
        text?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        votes: number;
        id?: string | null;
        text?: string | null;
    }, {}, {}> & {
        votes: number;
        id?: string | null;
        text?: string | null;
    }>;
    duration: number;
    isActive: boolean;
    endsAt: number;
    startTime?: number | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    question: string;
    options: mongoose.Types.DocumentArray<{
        votes: number;
        id?: string | null;
        text?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        votes: number;
        id?: string | null;
        text?: string | null;
    }, {}, {}> & {
        votes: number;
        id?: string | null;
        text?: string | null;
    }>;
    duration: number;
    isActive: boolean;
    endsAt: number;
    startTime?: number | null;
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
        question: string;
        options: mongoose.Types.DocumentArray<{
            votes: number;
            id?: string | null;
            text?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            votes: number;
            id?: string | null;
            text?: string | null;
        }, {}, {}> & {
            votes: number;
            id?: string | null;
            text?: string | null;
        }>;
        duration: number;
        isActive: boolean;
        endsAt: number;
        startTime?: number | null;
    }, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<{
        question: string;
        options: mongoose.Types.DocumentArray<{
            votes: number;
            id?: string | null;
            text?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            votes: number;
            id?: string | null;
            text?: string | null;
        }, {}, {}> & {
            votes: number;
            id?: string | null;
            text?: string | null;
        }>;
        duration: number;
        isActive: boolean;
        endsAt: number;
        startTime?: number | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    question: string;
    options: mongoose.Types.DocumentArray<{
        votes: number;
        id?: string | null;
        text?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        votes: number;
        id?: string | null;
        text?: string | null;
    }, {}, {}> & {
        votes: number;
        id?: string | null;
        text?: string | null;
    }>;
    duration: number;
    isActive: boolean;
    endsAt: number;
    startTime?: number | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    question: string;
    options: mongoose.Types.DocumentArray<{
        votes: number;
        id?: string | null;
        text?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        votes: number;
        id?: string | null;
        text?: string | null;
    }, {}, {}> & {
        votes: number;
        id?: string | null;
        text?: string | null;
    }>;
    duration: number;
    isActive: boolean;
    endsAt: number;
    startTime?: number | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Poll.d.ts.map