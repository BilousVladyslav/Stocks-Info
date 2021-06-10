export class ProductInfo {
    id?: number;
    code?: string;
    name?: string;
    sector?: string;
    description?: string;
    created?: string;
    logo_url?: string;
}

export class HistoryModel{
    Date?: Date;
    Open?: number;
    High?: number;
    Low?: number;
    Close?: number;
    Volume?: number;
    Dividends?: number;
    StockSplits?: number;
}

export class InfoModel{
    sector?: string;
    longBusinessSummary?: string;
    country?: string;
    city?: string;
    logo_url?: string;
    longName?: string;
    website?: string;
    industry?: string;
}

export class RecomendationModel{
    Firm?: string;
    ToGrade?: string;
    FromGrade?: string;
    Action?: string;
}

export class ProductInfoDetail{
    id?: number;
    code?: string;
    name?: string;
    sector?: string;
    description?: string;
    created?: string;
    history?: HistoryModel[];
    last_recommendations?: RecomendationModel;
    info?: InfoModel;
    logo_url?: string;
}
