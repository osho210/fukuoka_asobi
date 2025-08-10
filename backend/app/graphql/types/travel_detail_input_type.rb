module Types
  class TravelDetailInputType < Types::BaseInputObject
    description "移動詳細の入力タイプ"

    argument :id, ID, required: false, description: "移動詳細ID（更新時のみ）"
    argument :sequence_number, Integer, required: true, description: "移動順序番号"
    argument :travel_method, String, required: true, description: "移動方法（徒歩、電車、車、自転車、その他）"
    argument :travel_time, Integer, required: false, description: "移動時間（分）"
    argument :notes, String, required: false, description: "メモ"
  end
end
