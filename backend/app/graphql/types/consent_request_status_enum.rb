# frozen_string_literal: true

module Types
  class ConsentRequestStatusEnum < Types::BaseEnum
    value 'DRAFT', '下書き'
    value 'SENT', '送信済み'
    value 'APPROVED', '承諾済み'
    value 'REJECTED', '否認'
    value 'REVOKED', '撤回'
    value 'EXPIRED', '期限切れ'
  end
end
