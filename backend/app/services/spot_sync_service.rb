class SpotSyncService
  def initialize(spot)
    @spot = spot
    @google_places_service = GooglePlacesService.new
  end

  def sync_with_google_places(google_place_id)
    place_details = @google_places_service.get_place_details(google_place_id)

    return false if place_details.nil? || place_details['error'].present?

    ActiveRecord::Base.transaction do
      update_spot_with_place_details(place_details)
      update_opening_hours(place_details['regularOpeningHours']) if place_details['regularOpeningHours']
    end
    true
  rescue => e
    Rails.logger.error "SpotSyncService Error: #{e.message}"
    false
  end

  private

  def update_spot_with_place_details(details)
    payment_options = details.fetch('paymentOptions', {})
    parking_options = details.fetch('parkingOptions', {})

    @spot.update!(
      google_place_id: details['id'],
      spot_name: details.dig('displayName', 'text') || @spot.spot_name,
      address: details['formattedAddress'],
      phone_number: details['nationalPhoneNumber'],
      website: details['websiteUri'],
      latitude: details.dig('location', 'latitude'),
      longitude: details.dig('location', 'longitude'),
      review_rating: details['rating'],
      review_count: details['userRatingCount'],
      business_status: details['businessStatus']&.downcase,
      price_level: details['priceLevel']&.downcase,
      google_maps_uri: details['googleMapsUri'],
      primary_type: details['primaryType'],
      primary_type_display_name: details.dig('primaryTypeDisplayName', 'text'),
      international_phone_number: details['internationalPhoneNumber'],
      short_formatted_address: details['shortFormattedAddress'],

      # サービス提供情報
      takeout: details['takeout'],
      delivery: details['delivery'],
      dine_in: details['dineIn'],
      reservable: details['reservable'],
      serves_breakfast: details['servesBreakfast'],
      serves_lunch: details['servesLunch'],
      serves_dinner: details['servesDinner'],
      serves_brunch: details['servesBrunch'],
      serves_beer: details['servesBeer'],
      serves_wine: details['servesWine'],
      serves_vegetarian_food: details['servesVegetarianFood'],
      outdoor_seating: details['outdoorSeating'],
      live_music: details['liveMusic'],
      menu_for_children: details['menuForChildren'],
      serves_cocktails: details['servesCocktails'],
      serves_dessert: details['servesDessert'],
      serves_coffee: details['servesCoffee'],
      good_for_children: details['goodForChildren'],
      allows_dogs: details['allowsDogs'],
      restroom: details['restroom'],
      good_for_groups: details['goodForGroups'],
      good_for_watching_sports: details['goodForWatchingSports'],

      # Payment Options
      accepts_credit_cards: payment_options['acceptsCreditCards'],
      accepts_debit_cards: payment_options['acceptsDebitCards'],
      accepts_cash_only: payment_options['acceptsCashOnly'],
      accepts_nfc: payment_options['acceptsNfc'],

      # Parking Options
      free_parking_lot: parking_options['freeParkingLot'],
      paid_parking_lot: parking_options['paidParkingLot'],
      free_street_parking: parking_options['freeStreetParking'],
      paid_street_parking: parking_options['paidStreetParking'],
      valet_parking: parking_options['valetParking'],
      free_garage_parking: parking_options['freeGarageParking'],
      paid_garage_parking: parking_options['paidGarageParking'],

      last_api_sync_at: Time.current,
      api_sync_status: 'success'
    )
  end

  def update_opening_hours(opening_hours_data)
    @spot.opening_hours.destroy_all

    return unless opening_hours_data['periods']

    day_map = %w[日 月 火 水 木 金 土]

    opening_hours_data['periods'].each do |period|
      open_time = format_time(period.dig('open', 'hour'), period.dig('open', 'minute'))
      close_time = format_time(period.dig('close', 'hour'), period.dig('close', 'minute'))
      day_of_week = day_map[period.dig('open', 'day')]

      next unless open_time && close_time && day_of_week

      @spot.opening_hours.create!(
        day_of_week: day_of_week,
        open_time: open_time,
        close_time: close_time,
        is_closed_day: false
      )
    end
  end

  def format_time(hour, minute)
    return nil if hour.nil? || minute.nil?
    "#{format('%02d', hour)}:#{format('%02d', minute)}:00"
  end
end
