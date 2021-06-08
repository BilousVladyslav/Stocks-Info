export class SubscriptionModel {
    subscription_end?: string;
    subscription_start?: string;
    status?: string;
    amount?: number;
    id?: string;
    payment_data?: string;
    payment_signature?: string;
}

export class SubscriptionInfoModel {
    start_date?: string;
    end_date?: string;
    amount?: string;
}