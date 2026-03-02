export declare class PollService {
    static createPoll(data: {
        question: string;
        options: string[];
        duration: number;
    }): Promise<import("mongoose").Document<unknown, {}, {
        question: string;
        options: import("mongoose").Types.DocumentArray<{
            votes: number;
            id?: string | null;
            text?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
    }, import("mongoose").DefaultSchemaOptions> & Omit<{
        question: string;
        options: import("mongoose").Types.DocumentArray<{
            votes: number;
            id?: string | null;
            text?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    static submitVote(pollId: string, studentId: string, optionId: string): Promise<import("mongoose").Document<unknown, {}, {
        question: string;
        options: import("mongoose").Types.DocumentArray<{
            votes: number;
            id?: string | null;
            text?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
    }, import("mongoose").DefaultSchemaOptions> & Omit<{
        question: string;
        options: import("mongoose").Types.DocumentArray<{
            votes: number;
            id?: string | null;
            text?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    static getCurrentPoll(studentId?: string): Promise<{
        poll: null;
        remainingTime: number;
        hasVoted: boolean;
    } | {
        poll: import("mongoose").Document<unknown, {}, {
            question: string;
            options: import("mongoose").Types.DocumentArray<{
                votes: number;
                id?: string | null;
                text?: string | null;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
        }, import("mongoose").DefaultSchemaOptions> & Omit<{
            question: string;
            options: import("mongoose").Types.DocumentArray<{
                votes: number;
                id?: string | null;
                text?: string | null;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        };
        remainingTime: number;
        hasVoted: boolean;
    }>;
    static getPollHistory(): Promise<(import("mongoose").Document<unknown, {}, {
        question: string;
        options: import("mongoose").Types.DocumentArray<{
            votes: number;
            id?: string | null;
            text?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
    }, import("mongoose").DefaultSchemaOptions> & Omit<{
        question: string;
        options: import("mongoose").Types.DocumentArray<{
            votes: number;
            id?: string | null;
            text?: string | null;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
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
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    })[]>;
}
//# sourceMappingURL=poll.service.d.ts.map