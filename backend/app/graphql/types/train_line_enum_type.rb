# frozen_string_literal: true

module Types
    class TrainLineEnumType < Types::BaseEnum
        description "電車の路線"
        # JR九州
        value "jr_kagoshima_honsen" ,"JR鹿児島本線"
        value "jr_chikuho_honsen" ,"JR筑豊本線"
        value "jr_nitto_honsen" ,"JR日豊本線"
        value "jr_sasaguri_sen" ,"JR篠栗線"
        value "jr_hitahiko_sansen" ,"JR日田彦山線"
        value "jr_kashii_sen" ,"JR香椎線"
        value "jr_hitahiko_sansen_brt" ,"JR日田彦山線BRT"
        value "jr_kyudai_honsen" ,"JR久大本線"
        value "jr_gotoji_sen" ,"JR後藤寺線"
        value "jr_kyushu_shin_kaisen" ,"JR九州新幹線"
        value "jr_sanyou_shinkansen" ,"JR山陽新幹線"
        value "jr_hakataminami_sen" ,"JR博多南線"
        value "jr_sanyou_honsen" ,"JR山陽本線"
        value "jr_chikuhisen","JR筑肥線"

        # 平成筑豊鉄道
        value "heichiku_tagawa_sen" ,"平成筑豊鉄道田川線"
        value "heichiku_ita_sen" ,"平成筑豊鉄道伊田線"
        value "heichiku_itoda_sen" ,"平成筑豊鉄道糸田線"
        value "heichiku_mojiko_sen" ,"平成筑豊鉄道門司港レトロ観光線"

        # 西日本鉄道 (西鉄)
        value "nishitetsu_tenjin_omuta_sen" ,"西鉄天神大牟田線"
        value "nishitetsu_amagi_sen" ,"西鉄甘木線"
        value "nishitetsu_kaizuka_sen" ,"西鉄貝塚線"
        value "nishitetsu_dazaifu_sen" ,"西鉄太宰府線"

        # 福岡市交通局(地下鉄)
        value "chikatetsu_nanakuma_sen" ,"地下鉄七隈線"
        value "chikatetsu_kuko_sen" ,"地下鉄空港線"
        value "chikatetsu_hakozaki_sen" ,"地下鉄箱崎線"

        # 皿倉登山鉄道
        value "sarakurayama_cable_car" ,"皿倉登山鉄道ケーブルカー"
        value "sarakurayama_slope_car" ,"皿倉登山鉄道スロープカー"

        # 甘木鉄道
        value "amagi_amagi_sen" ,"甘木鉄道甘木線"

        # 筑豊電気鉄道
        value "chikuhodenki_chikuhodenki_sen" ,"筑豊電気鉄道線"

        # 北九州高速鉄道
        value "kitakyukosoku_kokura_sen" ,"北九州高速鉄道小倉線"
    end
end