
export interface CreateKeyToken {
    shopId : string;
    keyAccess: string;
    keyRefresh: string;
} 

export interface IGenerateTokenPair extends Omit<CreateKeyToken, "shopId"> {
    payload: {
        id: string,
        email: string
    }
}