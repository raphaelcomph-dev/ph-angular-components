export class ErrorMessages {
    static readonly inputFieldRequired = (fieldName: string): string =>
        `O campo '${fieldName}' é obrigatório.`;

    static readonly dateTimelineInvalid = (
        fieldName: string,
        shouldBeInFuture: boolean,
        shouldBeInPast: boolean,
    ): string => {
        if (shouldBeInFuture) {
            return `O campo '${fieldName}' precisa ser uma data igual ou posterior a data atual.`;
        }
        if (shouldBeInPast) {
            return `O campo '${fieldName}' precisa ser uma data igual ou anterior a data atual.`;
        }
        return `O campo '${fieldName}' precisa ser uma data válida.`;
    };
}
