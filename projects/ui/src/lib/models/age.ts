export interface AgeData {
    years: number;
    months: number;
    weeks?: number;
    days: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
}

export class Age implements AgeData {
    years: number;
    months: number;
    weeks?: number;
    days: number;
    hours?: number;
    minutes?: number;
    seconds?: number;

    constructor(data: AgeData) {
        this.years = data.years;
        this.months = data.months;
        this.weeks = data.weeks;
        this.days = data.days;
        this.hours = data.hours;
        this.minutes = data.minutes;
        this.seconds = data.seconds;
    }

    /**
     * Check if age is zero (no time has passed)
     */
    isZero(): boolean {
        return (
            this.days === 0 &&
            (!this.weeks || this.weeks === 0) &&
            this.months === 0 &&
            this.years === 0
        );
    }

    /**
     * Convert age to human-readable string
     * @param short If true, returns only the largest unit
     * @param includePrefix If true, adds "faz" or "daqui a" prefix based on reference date
     * @param referenceDate The date being compared (for prefix calculation)
     * @param onDate The date to compare against (defaults to now)
     */
    toString(
        short: boolean = false,
        includePrefix: boolean = false,
        referenceDate?: Date,
        onDate?: Date,
    ): string {
        const ageParts: string[] = [];

        if (this.years > 0) {
            ageParts.push(`${this.years} ${this.years > 1 ? 'anos' : 'ano'}`);
            if (short) return this.formatParts(ageParts, includePrefix, referenceDate, onDate);
        }

        if (this.months > 0) {
            ageParts.push(`${this.months} ${this.months > 1 ? 'meses' : 'mês'}`);
            if (short) return this.formatParts(ageParts, includePrefix, referenceDate, onDate);
        }

        if (this.weeks && this.weeks > 0) {
            ageParts.push(`${this.weeks} ${this.weeks > 1 ? 'semanas' : 'semana'}`);
            if (short) return this.formatParts(ageParts, includePrefix, referenceDate, onDate);
        }

        if (this.days > 0) {
            ageParts.push(`${this.days} ${this.days > 1 ? 'dias' : 'dia'}`);
        }

        return this.formatParts(ageParts, includePrefix, referenceDate, onDate);
    }

    private formatParts(
        parts: string[],
        includePrefix: boolean,
        referenceDate?: Date,
        onDate?: Date,
    ): string {
        let response = this.joinParts(parts);

        if (includePrefix && referenceDate && onDate) {
            const prefix = referenceDate.getTime() < onDate.getTime() ? 'faz' : 'daqui a';
            response = `${prefix} ${response}`;
        }

        return response;
    }

    private joinParts(parts: string[]): string {
        if (parts.length === 0) return '';
        if (parts.length === 1) return parts[0];
        if (parts.length === 2) return `${parts[0]} e ${parts[1]}`;

        return `${parts.slice(0, -1).join(', ')} e ${parts.at(-1)}`;
    }
}
