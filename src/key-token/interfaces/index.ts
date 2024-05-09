
export interface CreateKeyToken {
    shopId : string;
    keyAccess: string;
    keyRefresh: string;
    refreshToken : string;
} 

export interface IGenerateTokenPair extends Omit<CreateKeyToken, "shopId" | "refreshToken"> {
    payload: {
        id: string,
        email: string
    }
}

export interface IGenTokenVerifyEmail extends Pick<IGenerateTokenPair, "payload"> {
    key: string;
}