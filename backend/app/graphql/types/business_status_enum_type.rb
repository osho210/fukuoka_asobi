module Types
    class BusinessStatusEnumType < Types::BaseEnum
        description "ビジネスステータス"
        value "BUSINESS_STATUS_UNSPECIFIED", value: "unspecified", description: "未設定"
        value "OPERATIONAL", value: "operational", description: "営業中"
        value "CLOSED_TEMPORARILY", value: "closed_temporarily", description: "休業中"
        value "CLOSED_PERMANENTLY", value: "closed_permanently", description: "閉店"
    end
end