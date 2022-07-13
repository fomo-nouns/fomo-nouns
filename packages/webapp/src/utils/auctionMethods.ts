const settleMethodIds = ['0xf25efffc', '0x1b16802c']
const bidMethodId = '0x659dd2b4'

export const isSettleMethod = (methodId: string) => {
    return settleMethodIds.includes(methodId);
};

export const isBidMethod = (methodId: string) => {
    return methodId === bidMethodId;
};